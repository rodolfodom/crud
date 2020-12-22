const d = document,
  $tabla = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.querySelector("#crud-template").content,
  $fragment = d.createDocumentFragment();

let getAll = async () => {
  try {
    let response = await fetch("http://localhost:3000/perros"),
      json = await response.json();
    //console.log(json);

    if (!response.ok)
      throw {
        status: response.status,
        statusText: response.statusText,
      };

    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".race").textContent = el.raza;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.race = el.raza;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".delete").dataset.id = el.id;
      $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $tabla.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    $tabla.insertAdjacentHTML(
      "afterend",
      `<p>${err.status}: <b>${err.statusText}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      //POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              raza: e.target.raza.value,
            }),
          },
          response = await fetch("http://localhost:3000/perro", options);
        if (!response.ok)
          throw { status: response.status, statusText: response.statusText };
      } catch (error) {
        $form.insertAdjacentHTML(
          "afterend",
          "<p>Ocurrió un error en el post</p>"
        );
      }
    } else {
      //PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              raza: e.target.raza.value,
            }),
          },
          response = await fetch(
            `http://localhost:3000/perros/${e.target.id.value}`,
            options
          );

        if (!response.ok) throw new Error("Error en update");
        location.reload();
      } catch (err) {
        $form.insertAdjacentHTML(
          "afterend",
          "<p>Ocurrió un error en el update</p>"
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar perro";
    $form.nombre.value = e.target.dataset.name;
    $form.raza.value = e.target.dataset.race;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    try {
      let options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
        confimation = confirm(
          `Estas seguro que quieres eliminar el elemento ${e.target.dataset.id}`
        );
      if (confimation) {
        let response = await fetch(
          `http://localhost:3000/perros/${e.target.dataset.id}`,
          options
        );
        if (!response.ok) throw new Error("Error al eliminar el elemento");
        location.reload();
      }
    } catch (error) {
      alert("Error al eliminar el elemento");
    }
  }
});
