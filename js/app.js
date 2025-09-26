document.addEventListener("DOMContentLoaded", () => {
  fetch("data/lecturers.json")
    .then((res) => res.json())
    .then((data) => {
      renderLecturers(data.faculties);
    });

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", handleSearch);
});

function renderLecturers(faculties) {
  const container = document.getElementById("lecturerList");
  container.innerHTML = "";

  faculties.forEach((faculty) => {
    const facultyDiv = document.createElement("div");
    facultyDiv.classList.add("faculty");

    const title = document.createElement("h2");
    title.textContent = faculty.name;
    facultyDiv.appendChild(title);

    faculty.lecturers.forEach((lecturer) => {
      const lecturerDiv = document.createElement("div");
      lecturerDiv.classList.add("lecturer");

      lecturerDiv.innerHTML = `
        <h3>${lecturer.name}</h3>
        <p><strong>Courses:</strong> ${lecturer.courses.join(", ")}</p>
        <p><strong>Average Rating:</strong> ${getAverageRating(
          lecturer.reviews
        )} ⭐</p>
        <div class="reviews">
          ${lecturer.reviews
            .map((r) => `<p>"${r.comment}" - ${r.student} (${r.rating}⭐)</p>`)
            .join("")}
        </div>
      `;

      facultyDiv.appendChild(lecturerDiv);
    });

    container.appendChild(facultyDiv);
  });
}

function getAverageRating(reviews) {
  if (reviews.length === 0) return "No ratings yet";
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.length).toFixed(1);
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  fetch("data/lecturers.json")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.faculties
        .map((faculty) => {
          return {
            ...faculty,
            lecturers: faculty.lecturers.filter(
              (l) =>
                l.name.toLowerCase().includes(query) ||
                faculty.name.toLowerCase().includes(query) ||
                l.courses.some((c) => c.toLowerCase().includes(query))
            ),
          };
        })
        .filter((f) => f.lecturers.length > 0);

      renderLecturers(filtered);
    });
}
