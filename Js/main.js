let filters = document.querySelectorAll(".projects ul li");
let projectItmes = document.querySelectorAll(".projects .project");

filters.forEach((filter) => {
  filter.addEventListener("click", function () {
    projectItmes.forEach((project) => {
      project.style.display = "none";

      let filterType = this.getAttribute("filter-type");

      let projectType = project.getAttribute("project-type");

      if (filterType == projectType) project.style.display = "block";
    });
  });
});

filters[2].querySelector("a").click();

let readMoreItmes = document.querySelectorAll(".projects .project .info span");

readMoreItmes.forEach((item) => {
  item.addEventListener("click", function () {
    let descriptionType = this.getAttribute("description-type");

    let description = descriptionProjects[descriptionType];

    ShowDescriptionProject(description);
  });
});

const descriptionProjects = {
  facebook: `
    A social media platform inspired by the real Facebook, featuring user
    authentication , profile management, posts, comments, likes ,and an activity log . Built with
    .NET on the backend and a responsive, user-friendly interface on the frontend,
    it mimics core Facebook functionalities while ensuring data security,
    scalability, and smooth performance . 
    `,

  "bank-system": `
    The Bank System project is a comprehensive web application designed to
    efficiently manage various banking operations . The Dashboard provides real-time
    data on clients, transfers, and currencies. Users can manage client information,
    perform deposits, withdrawals, and transfers, and view transfer histories. The
    system also includes currency management, allowing users to monitor and exchange
    currencies efficiently . The project highlights essential banking
    functionalities, with a focus on simplicity and user-friendly design . 
    `,

  dvld: `
    The Driving Licenses Management is a comprehensive system designed to
    handle all aspects of issuing and managing driving licenses. It provides
    services like first-time license issuance, renewal, replacement for lost or
    damaged licenses, as well as international license issuance ,and releasing
    detained licenses. The system also manages license categories, personal details
    of applicants, and ensures compliance with age and testing requirements .
    Additionally, it offers administrative functionalities for managing users,
    license categories, request statuses, and testing results, making it a
    comprehensive tool for any driving license authority .
    `,

  hotel: `
    Hotel Management System is designed to efficiently manage hotel operations. Key
    features include functionalities for managing guests, room types, rooms,
    reservations, bookings, and services . The system allows for smooth handling of
    guest check-ins and check-outs, and supports the addition of services during a
    guest’s stay. Users can manage reservations with detailed information on guests,
    room numbers, types, costs, and reservation statuses . This system streamlines
    hotel management and ensures smooth operations for both guests and staff .
    `,

  clinic: `
    Clinic management system is designed to simplify the daily operations of a
    clinic by providing functionalities to manage appointments, sessions, patients,
    doctors, services, and medications . It includes features for patient
    registration, appointment scheduling, track the status of appointments, and
    sessions are displayed in real-time to ensure smooth clinic operations . This
    system enables clinics to operate efficiently, improving for both patient care
    and administrative tasks, making it a comprehensive solution for efficient
    clinic management .
  `,

  "products-management": `
    Products Management Project is designed to streamline the management of product
    inventory. It allows users to manage orders, customers, and products
    efficiently. The user-friendly interface provides efficient navigation for users
    to track product details, prices, and availability, ensuring optimal inventory
    control and management . The system also supports detailed order tracking ,
    providing a streamlined solution for both inventory and sales management,
    ensuring high operational efficiency .
  `,

  institution: `
    This project is designed to manage educational processes within an organization.
    Key features include student and course enrollment management, course
    administration, and tracking of teachers . The system provides an intuitive
    interface for both administrators and students, ensuring seamless communication
    and efficient management of educational resources .
  `,

  "blood-bank": `
    This project is designed to streamline the operations of a blood bank by
    enabling efficient tracking of donors, managing patients, and monitoring blood
    stock levels. The system facilitates blood transfers between patients and the
    stock, ensuring availability is checked before transfers. It also includes a
    feature to view the history of blood transfers, making it easier to maintain
    records . The system aims to enhance the efficiency of blood donation processes
    and improve the availability of blood supplies for medical emergencies .
    `,
};

let ShowDesciptionProjectBtn = document.querySelector(
  ".desciption-project button"
);

let DesciptionProjectBoday = document.querySelector(
  ".desciption-project .modal-body"
);

function ShowDescriptionProject(description) {
  DesciptionProjectBoday.textContent = description;

  ShowDesciptionProjectBtn.click();
}
