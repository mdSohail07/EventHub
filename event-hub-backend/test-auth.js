// test-auth.js
async function testAuth() {
    console.log("1. Creating a new user...");
    const signupRes = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "test@coder.com", password: "mypassword123" })
    });
    console.log("Signup Response:", await signupRes.json());

    console.log("\n2. Logging in with the same user...");
    const loginRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "test@coder.com", password: "mypassword123" })
    });
    console.log("Login Response:", await loginRes.json());
}

testAuth();