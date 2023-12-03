
this.onmessage = function (e) {
    try {
      if (e.data !== null) {
        const jsonDataString = e.data;
        const jsonData = JSON.parse(jsonDataString);
        postMessage(jsonData);
      }
    } catch (error) {
      console.error("Error parsing JSON in worker:", error);
    }
};
