const VISION_AGENT_URL = process.env.VISION_AGENT_URL || "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callId, sessionId } = body;

    if (!callId || !sessionId) {
      return Response.json({ error: "Missing callId or sessionId" }, { status: 400 });
    }

    const url = `${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}`;
    console.log(`Proxying stop session request to Vision Agent: ${url}`);

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Vision Agent stop session failed: ${response.status} - ${errText}`);
      
      // Fallback: try closing using POST beacon endpoint if DELETE failed/was not found
      const closeUrl = `${VISION_AGENT_URL}/calls/${callId}/sessions/${sessionId}/close`;
      console.log(`Trying fallback POST close endpoint: ${closeUrl}`);
      const closeResponse = await fetch(closeUrl, { method: "POST" });
      if (!closeResponse.ok) {
        const closeErrText = await closeResponse.text();
        return Response.json(
          { error: `Vision Agent server returned error: ${closeResponse.status}`, details: closeErrText },
          { status: closeResponse.status }
        );
      }
    }

    console.log(`Vision Agent stop session success for ${sessionId}`);
    return Response.json({ success: true, sessionId });
  } catch (error: any) {
    console.error("Error in stop agent API route:", error);
    return Response.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
