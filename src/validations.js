
function validateEmail(email) {
    // Check for '@' and '.'
    if (email.includes("@") && email.includes(".")) {
        const atIndex = email.indexOf("@");
        const lastDotIndex = email.lastIndexOf(".");

        // Ensure '@' is before the last '.', and neither are at invalid positions
        if (atIndex > 0 && lastDotIndex > atIndex + 1 && lastDotIndex < email.length - 1) {
            console.log("Valid email address");
            return;
        }
    }

    console.log("Invalid email address");
}



export  {validateEmail};