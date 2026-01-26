
const formId = "mzdrdqlo";
const url = `https://formspree.io/f/${formId}`;

async function testForm() {
  console.log(`Testing Formspree ID: ${formId}`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: "test@example.com",
        message: "This is a test message from the developer checking the form ID."
      })
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testForm();
