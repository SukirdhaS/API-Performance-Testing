document.addEventListener("DOMContentLoaded", () => {
  const hospitalSelect = document.getElementById("hospital");
  const insurerSelect = document.getElementById("insurer");
  const form = document.getElementById("eligibilityForm");
  const result = document.getElementById("result");

  // Fetch hospitals
  fetch("http://localhost:3001/hospitals")
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.hospital_name;
        option.textContent = item.hospital_name;
        hospitalSelect.appendChild(option);
      });
    });

  // Fetch insurers
  fetch("http://localhost:3001/insurer")
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.insurer_name;
        option.textContent = item.insurer_name;
        insurerSelect.appendChild(option);
      });
    });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const hospital = hospitalSelect.value;
    const insurer = insurerSelect.value;

    fetch(`http://localhost:3001/api/eligibility?hospital=${encodeURIComponent(hospital)}&insurer=${encodeURIComponent(insurer)}`)
      .then(res => res.json())
      .then(data => {
        result.textContent = data.message;
        result.style.color = data.eligible ? "green" : "red";
      })
      .catch(err => {
        console.error(err);
        result.textContent = "Something went wrong. Try again.";
        result.style.color = "orange";
      });
  });
});
