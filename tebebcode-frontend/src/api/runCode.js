
export async function runCodeWithJDoodle({ code, language = "nodejs", stdin = "", versionIndex = "4" }) {
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.code_exe_client,        
        clientSecret: process.env.code_exe_clientSec, 
        script: code,
        stdin,
        language,
        versionIndex
      }),
    });
  
    const result = await response.json();
    return result;
  }
  