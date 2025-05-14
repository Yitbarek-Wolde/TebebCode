export async function runCodeWithJDoodle({ code, language = "nodejs", stdin = "", versionIndex = "4" }) {
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: "89dc6bafb0ec5274d82f70a707ed42c6",        
        clientSecret: "f1ee416a9609a8cb7dcd7724616a9c950c8c55a24abe720c1028a1ddc6950cee", 
        script: code,
        stdin,
        language,
        versionIndex
      }),
    });
  
    const result = await response.json();
    return result;
  }
  