const STREAM_API_KEY = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

async function base64UrlEncode(str: string): Promise<string> {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (x) => String.fromCharCode(x)).join("");
  const base64 = btoa(binString);
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function generateJWT(payload: any, secret: string): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = await base64UrlEncode(JSON.stringify(header));
  const encodedPayload = await base64UrlEncode(JSON.stringify(payload));
  const tokenInput = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(tokenInput)
  );

  const signatureBytes = new Uint8Array(signature);
  const signatureBinString = Array.from(signatureBytes, (x) => String.fromCharCode(x)).join("");
  const signatureBase64 = btoa(signatureBinString);
  const encodedSignature = signatureBase64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${tokenInput}.${encodedSignature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      userImage,
      lessonId,
      lessonTitle,
      languageId,
      languageName,
      goals,
      vocabulary,
      phrases,
      aiTeacherPrompt,
    } = body;

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      return Response.json(
        { error: "Stream API credentials are not configured on the server" },
        { status: 500 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    
    // User token
    const userPayload = {
      user_id: userId,
      iat: now - 60,
      exp: now + 3600 * 24, // 24 hours
    };
    const userToken = await generateJWT(userPayload, STREAM_API_SECRET);

    // Server token for administrative REST call
    const serverPayload = {
      server: true,
      iat: now - 60,
      exp: now + 3600, // 1 hour
    };
    const serverToken = await generateJWT(serverPayload, STREAM_API_SECRET);

    // Construct a safe call ID
    const cleanId = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, "_");
    const callId = cleanId(`call_${lessonId || "general"}_${userId}`);
    const callType = "audio_room";

    // Call Stream REST API to get or create the call
    const url = `https://video.stream-io-api.com/video/call/${callType}/${callId}?api_key=${STREAM_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stream-auth-type": "jwt",
        "Authorization": serverToken,
      },
      body: JSON.stringify({
        data: {
          created_by_id: userId,
          members: [
            {
              user_id: userId,
              role: "admin",
            },
            {
              user_id: "ai-teacher",
              role: "admin",
            },
          ],
          custom: {
            lessonId: lessonId || "",
            lessonTitle: lessonTitle || "",
            languageId: languageId || "",
            languageName: languageName || "",
            userName: userName || "",
            userImage: userImage || "",
            goals: goals || [],
            vocabulary: vocabulary || [],
            phrases: phrases || [],
            aiTeacherPrompt: aiTeacherPrompt || "",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Stream API call registration failed, returning credentials directly:", errorText);
      
      return Response.json({
        warning: "Call could not be registered on Stream servers. Using local connection.",
        errorDetails: errorText,
        apiKey: STREAM_API_KEY,
        token: userToken,
        callId,
        callType,
      });
    }

    const responseData = await response.json();

    return Response.json({
      apiKey: STREAM_API_KEY,
      token: userToken,
      callId,
      callType,
      call: responseData.call,
    });
  } catch (error: any) {
    console.error("Error in stream API route:", error);
    return Response.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
