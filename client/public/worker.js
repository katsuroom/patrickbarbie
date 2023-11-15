
// onmessage = ({ data }) => {
//     try {
//       const jsonData = JSON.parse(data);
//       postMessage({ success: true, jsonData });
//     } catch (error) {
//       postMessage({ success: false, error: error.message });
//     }
// };

// jsonParser.worker.js

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
  