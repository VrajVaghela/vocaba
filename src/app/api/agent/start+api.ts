const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callId } = body;

    if (!callId) {
      return Response.json({ error: "Missing callId" }, { status: 400 });
    }

    const url = `${VISION_AGENT_URL}/calls/${callId}/sessions`;
    console.log(`Proxying start session request to Vision Agent: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        call_type: "audio_room",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Vision Agent start session failed: ${response.status} - ${errText}`);
      return Response.json(
        { error: `Vision Agent server returned error: ${response.status}`, details: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Vision Agent start session success:`, data);
    return Response.json(data);
  } catch (error: any) {
    console.error("Error in start agent API route:", error);
    return Response.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
