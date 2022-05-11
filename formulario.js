const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^(?=.{6,}$)(?=.*[a-z])(?=.*[0-9]).*$/, // 6 digitos y almenos 1 numero.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}

function checkRut(rut) {
	// Despejar Puntos
	var valor = rut.value.replace('.','');
	// Despejar Guión
	valor = valor.replace('-','');
	
	// Aislar Cuerpo y Dígito Verificador
	cuerpo = valor.slice(0,-1);
	dv = valor.slice(-1).toUpperCase();
	
	// Formatear RUN
	rut.value = cuerpo + '-'+ dv
		
	// Calcular Dígito Verificador
	suma = 0;
	multiplo = 2;
	
	// Para cada dígito del Cuerpo
	for(i=1;i<=cuerpo.length;i++) {
	
		// Obtener su Producto con el Múltiplo Correspondiente
		index = multiplo * valor.charAt(cuerpo.length - i);
		
		// Sumar al Contador General
		suma = suma + index;
		
		// Consolidar Múltiplo dentro del rango [2,7]
		if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
  
	}
	
	// Calcular Dígito Verificador en base al Módulo 11
	dvEsperado = 11 - (suma % 11);
	
	// Casos Especiales (0 y K)
	dv = (dv == 'K')?10:dv;
	dv = (dv == 0)?11:dv;
	

	// Si no cumple con el mínimo ej. (n.nnn.nnn)
	if(cuerpo.length <= 7 || cuerpo.length >= 9) { 
		document.getElementById(`grupo__rut`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__rut`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__rut i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__rut i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__rut .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos['rut'] = false;
		}else if (dvEsperado != dv) { // Validar que el Cuerpo coincide con su Dígito Verificador
			document.getElementById(`grupo__rut`).classList.add('formulario__grupo-incorrecto');
			document.getElementById(`grupo__rut`).classList.remove('formulario__grupo-correcto');
			document.querySelector(`#grupo__rut i`).classList.add('fa-times-circle');
			document.querySelector(`#grupo__rut i`).classList.remove('fa-check-circle');
			document.querySelector(`#grupo__rut .formulario__input-error`).classList.add('formulario__input-error-activo');
			campos['rut'] = false;

			}else{ // Si todo sale bien, eliminar errores (decretar que es válido)
				document.getElementById(`grupo__rut`).classList.remove('formulario__grupo-incorrecto');
				document.getElementById(`grupo__rut`).classList.add('formulario__grupo-correcto');
				document.querySelector(`#grupo__rut i`).classList.remove('fa-times-circle');
				document.querySelector(`#grupo__rut i`).classList.add('fa-check-circle');
				document.querySelector(`#grupo__rut .formulario__input-error`).classList.remove('formulario__input-error-activo');
     			campos['rut'] = true;}	
}

const campos = {
	nombre: false,
	password: false,
	correo: false,
	rut: false
}

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "nombre":
			validarCampo(expresiones.nombre, e.target, 'nombre');
		break;
		case "password":
			validarCampo(expresiones.password, e.target, 'password');
			validarPassword2();
		break;
		case "password2":
			validarPassword2();
		break;
		case "correo":
			validarCampo(expresiones.correo, e.target, 'correo');
		break;
		case "rut":
			validarCampo(Function.checkRut, e.target, 'rut');
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
	}
}


const validarPassword2 = () => {
	const inputPassword1 = document.getElementById('password');
	const inputPassword2 = document.getElementById('password2');

	if(inputPassword1.value !== inputPassword2.value){
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos['password'] = false;
	} else {
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos['password'] = true;
	}
}

inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
	e.preventDefault();

	const terminos = document.getElementById('terminos');
	if( campos.nombre && campos.password && campos.correo && campos.rut){
		formulario.reset();

		document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 500);

		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
		setTimeout(() => {
			location.reload();
		}, 600);
		
	} else {
		document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
		
	}
});



const captcha = document.querySelector(".captcha"),
reloadBtn = document.querySelector(".reload-btn"),
inputField = document.querySelector(".input-area input"),
checkBtn = document.querySelector(".check-btn"),
statusTxt = document.querySelector(".status-text");


let allCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
                     'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
                     'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                     't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function getCaptcha(){
  for (let i = 0; i < 6; i++) { //CREA NA CADENA DE 6 CARACTERES AL AZAR
    let randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    captcha.innerText += ` ${randomCharacter}`; //agrega la cadena al captcha input
  }
}
getCaptcha(); //llama a crear el captcha y lo muestra

reloadBtn.addEventListener("click", ()=>{
  removeContent();
  getCaptcha();
});

checkBtn.addEventListener("click", e =>{
  e.preventDefault(); 
  statusTxt.style.display = "block";

  let inputVal = inputField.value.split('').join(' ');
  if(inputVal == captcha.innerText){ //comprueba si los captcha coinciden
    statusTxt.style.color = "#4db2ec";
    statusTxt.innerText = "Captcha Correcto.";   
	
  }else{
    statusTxt.style.color = "#ff0000";
	setTimeout(()=>{ //si no es correcto resetea el captcha
		removeContent();
		getCaptcha();
	  }, 160);
    statusTxt.innerText = "Captcha No Coinciden!";
  }
});

function removeContent(){
 inputField.value = "";
 captcha.innerText = "";
 statusTxt.style.display = "none";
}
