const d = document,
  $tabla = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.querySelector("#crud-template").content,
  $fragment = d.createDocumentFragment();

const getAllDogs = () => {
  ajax({
    url: "http://localhost:3000/perros",
    succes: (res) => {
      console.log(res);
      res.forEach((el) => {
        $template.querySelector(".name").textContent = el.nombre;
        $template.querySelector(".race").textContent = el.raza;
        $template.querySelector(".edit").dataset.id = el.id;
        $template.querySelector(".edit").dataset.name = el.nombre;
        $template.querySelector(".edit").dataset.race = el.raza;
        $template.querySelector(".delete").dataset.id = el.id;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });
      $tabla.querySelector("tbody").appendChild($fragment);
    },
    error: (err) => {
      console.warn(err);
      $tabla.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
    },
  });
};

d.addEventListener("DOMContentLoaded", getAllDogs);

const ajax = (options) => {
  let { url, method, succes, error, data } = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      succes(json);
    } else {
      let message = xhr.statusText || "Ocurrió un error";
      error(message);
    }
  });

  xhr.open(method || "GET", url);
  xhr.setRequestHeader("content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(data));
};

d.addEventListener("submit", (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      //create: POST
      ajax({
        url: "http://localhost:3000/perros",
        method: "POST",
        succes: (res) => location.reload(),
        error: (res) => console.warn("Error al hacer POST"),
        data: {
          nombre: e.target.nombre.value,
          raza: e.target.raza.value,
        },
      });
    } else {
      //update: PUT
      ajax({
        url: `http://localhost:3000/perros/${e.target.id.value}`,
        method: "PUT",
        succes: (res) => location.reload(),
        error: (res) => console.warn("Error al hacer update"),
        data: {
          nombre: e.target.nombre.value,
          raza: e.target.raza.value,
        },
      });
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".edit")) {
    $form.id.value = e.target.dataset.id;
    $form.nombre.value = e.target.dataset.name;
    $form.raza.value = e.target.dataset.race;
  }

  if (e.target.matches(".delete")) {
    let isConfirm = confirm(
      `Esta seguro de que quieres eliminar el elemento ${e.target.dataset.id}`
    );
    if (isConfirm) {
      ajax({
        url: `http://localhost:3000/perros/${e.target.dataset.id}`,
        method: "DELETE",
        succes: () => {
          location.reload();
          alert("El elemento fue eliminado");
        },
        error: () => alert("Ocurrió un error, no pudimos eliminar el elemento"),
      });
    }
  }
});
