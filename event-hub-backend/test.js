// test.js
async function testAI() {
    console.log("Sending raw text to AI route...");
    
    const response = await fetch('http://localhost:5000/api/events/ai-add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source_platform: "WhatsApp Group",
            application_link: "https://forms.gle/example-link",
            // Yeh ek random, unstructured message hai
            raw_text: "Hey everyone! Don't forget, the Advanced C++ Pointers and Memory Management Workshop is happening this weekend. It's completely free. Make sure you register by October 15th at 5 PM. It will be an online session."
        })
    });

    const data = await response.json();
    console.log("Response from Server:\n", JSON.stringify(data, null, 2));
}

testAI();