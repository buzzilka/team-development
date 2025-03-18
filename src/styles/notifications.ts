import Swal from "sweetalert2";

export const errorPopup = (
  title: string,
  error: string
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
        container: 'my-swal'
      }
  });

  Toast.fire({
    icon: "error",
    title: title,
    text: error,
  });
};

export const successPopup = (text: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
        container: 'my-swal'
      }
  });

  Toast.fire({
    icon: "success",
    title: "Успешно!",
    text: text
  });
};

export const infoPopup = (text: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
        container: 'my-swal'
      }
  });

  Toast.fire({
    icon: "info",
    title: "Внимание!",
    text: text
  });
};
