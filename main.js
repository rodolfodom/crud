const d = document,
  $tabla = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.querySelector("#crud-template").content,
  $fragment = d.createDocumentFragment();

async function getData() {
  try {
    let res = await axios.get("http://localhost:3000/perros"),
      json = res.data;
    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".race").textContent = el.raza;
      $template.querySelector(".edit").dataset.nombre = el.nombre;
      $template.querySelector(".edit").dataset.raza = el.raza;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".delete").dataset.id = el.id;
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $tabla.querySelector("tbody").appendChild($fragment);
  } catch (error) {
    console.log(error);
  }
}

d.addEventListener("DOMContentLoaded", getData);

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $form.nombre.value = e.target.dataset.nombre;
    $form.raza.value = e.target.dataset.raza;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let isConfirm = confirm(
      `Estas seguro de eliminar el objeto con id ${e.target.dataset.id}`
    );

    if (isConfirm) {
      try {
        await axios.delete(
          `http://localhost:3000/perros/${e.target.dataset.id}`
        );
        location.reload();
      } catch (error) {
        console.log(`Ocurrió un error al eliminar el elemento: ${error}`);
      }
    }
  }
});

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      //POST
      try {
        await axios.post("http://localhost:3000/perros", {
          nombre: e.target.nombre.value,
          raza: e.target.raza.value,
        });
        location.reload();
      } catch (error) {
        console.log(`Error en el post: ${error}`);
      }
    } else {
      //PUT

      try {
        await axios.put(`http://localhost:3000/perros/${e.target.id.value}`, {
          nombre: e.target.nombre.value,
          raza: e.target.raza.value,
        });
        location.reload();
      } catch (error) {
        console.log(`Ocurrió un error al editar: ${error}`);
      }
    }
  }
});
