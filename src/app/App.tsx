import { useEffect } from "react";

function App() {
  useEffect(() => {
    async function test() {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    }

    test();

    const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=ethusdt@ticker");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      // setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("Message received:", data);
      // setMessage(data);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      // setError(event);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // setIsConnected(false);
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>hello, world</div>
  );
}

export default App;