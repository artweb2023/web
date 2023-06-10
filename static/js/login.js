window.onload = () => {
    viewPassword();
    inputFocus();
    getForm();
}

function viewPassword() {
    const passwordClick = document.querySelector(".content-form__icon");
    passwordClick.addEventListener('click', showPassword);

    function showPassword() {
        const formInput = document.querySelectorAll(".content-form__input");
        const inputPasswordAttribute = formInput[1].getAttribute('type');
        const formInputPasswordValue = formInput[1].value;

        if (inputPasswordAttribute === "password" && formInputPasswordValue.trim() !== '') {
            formInput[1].setAttribute("type", "text");
            passwordClick.style.background = 'url("./img/eye-off.svg")';
        } else {
            formInput[1].setAttribute("type", "password");
            passwordClick.style.background = 'url("./img/eye.svg")';
        }
    }
}

function inputFocus() {
    const classFocus = 'form-input_focus';
    const formInput = document.querySelectorAll(".content-form__input");

    formInput.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.toggle(classFocus, input.value.trim() !== '');
        });
    });

}

function getForm() {
    const form = document.querySelector(".content-form");
    form.addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });

    function validateForm() {
        const ClassShow = 'show'
        const ClassNoShow = 'no-show'
        const ClassBorderAlert = 'border_alert'
        const ClassAnimation = 'content-status_animation'
        const ClassAnimationRemove = 'hide_animation'
        const AlertBlock = document.querySelector(".content-status")
        const AlertText = document.querySelector(".content-status__text")
        const AlertMessage = document.querySelectorAll(".content-form__alert")
        const FormInput = document.querySelectorAll(".content-form__input")


        function isValidEmail(value) {
            const EmailReg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
            return EmailReg.test(value)
        }


        const FormInputEmailValue = FormInput[0].value
        const FormInputPasswordValue = FormInput[1].value

        FormInput[0].addEventListener('input', () => {
            AlertBlock.classList.add(ClassAnimationRemove)
            FormInput[0].classList.remove(ClassBorderAlert)
            FormInput[1].classList.remove(ClassBorderAlert)
            AlertMessage[0].classList.add(ClassNoShow)
            AlertMessage[1].classList.add(ClassNoShow)
            AlertMessage[0].classList.remove(ClassShow)
        });

        FormInput[1].addEventListener('input', () => {
            AlertBlock.classList.remove(ClassAnimation)
            AlertBlock.classList.add(ClassAnimationRemove)
            FormInput[0].classList.remove(ClassBorderAlert)
            FormInput[1].classList.remove(ClassBorderAlert)
            AlertMessage[0].classList.add(ClassNoShow)
            AlertMessage[1].classList.add(ClassNoShow)
            AlertMessage[0].classList.remove(ClassShow)
        });

        if (isValidEmail(FormInputEmailValue) && (FormInputPasswordValue === "" || FormInputPasswordValue.length === 0 || FormInputPasswordValue === null)) {
            AlertBlock.classList.remove(ClassNoShow)
            FormInput[1].classList.add(ClassBorderAlert)
            AlertMessage[1].classList.remove(ClassNoShow)
            AlertMessage[1].classList.add(ClassShow)
            AlertText.textContent = 'A-Ah! Check all fields'
            AlertBlock.classList.remove(ClassAnimationRemove)
            AlertBlock.classList.add(ClassAnimation)
            return false
        }

        if ((FormInputEmailValue == "" || FormInputEmailValue.length == 0 || FormInputEmailValue.length == null) && (FormInputPasswordValue == "" || FormInputPasswordValue.length == 0 || FormInputPasswordValue.length == null)) {
            AlertBlock.classList.remove(ClassNoShow)
            FormInput[0].classList.add(ClassBorderAlert)
            FormInput[1].classList.add(ClassBorderAlert)
            AlertMessage[0].classList.remove(ClassNoShow)
            AlertMessage[1].classList.remove(ClassNoShow)
            AlertMessage[0].classList.add(ClassShow)
            AlertMessage[1].classList.add(ClassShow)
            AlertBlock.classList.add(ClassAnimation)
            AlertBlock.classList.remove(ClassAnimationRemove)
            AlertText.textContent = 'A-Ah! Check all fields'
            return false;
        }

        else if ((!isValidEmail(FormInputEmailValue)) && (FormInputPasswordValue == "" || FormInputPasswordValue.length == 0 || FormInputPasswordValue.length == null)) {
            AlertBlock.classList.remove(ClassNoShow)
            AlertMessage[0].classList.remove(ClassNoShow)
            FormInput[0].classList.add(ClassBorderAlert)
            AlertMessage[0].classList.add(ClassShow)
            FormInput[1].classList.add(ClassBorderAlert)
            AlertText.textContent = 'A-Ah! Check all fields'
            AlertMessage[0].textContent = 'Incorrect email format. Correct format is ****@**.***'
            AlertBlock.classList.add(ClassAnimation)
            AlertBlock.classList.remove(ClassAnimationRemove)
            return false;
        }
        else if ((!isValidEmail(FormInputEmailValue)) && !(FormInputPasswordValue == "" || FormInputPasswordValue.length == 0 || FormInputPasswordValue.length == null)) {
            AlertBlock.classList.remove(ClassNoShow)
            AlertMessage[0].classList.remove(ClassNoShow)
            FormInput[0].classList.add(ClassBorderAlert)
            FormInput[1].classList.add(ClassBorderAlert)
            AlertMessage[0].classList.add(ClassShow)
            AlertText.textContent = 'Email or password is incorrect.'
            AlertMessage[0].textContent = 'Incorrect email format. Correct format is ****@**.***'
            AlertBlock.classList.add(ClassAnimation)
            AlertBlock.classList.remove(ClassAnimationRemove)
            return false;
        }
        else {
            AlertBlock.classList.remove(ClassAnimation);
            AlertBlock.classList.add(ClassAnimationRemove)
            AlertMessage[0].classList.remove(ClassShow)
            AlertMessage[1].classList.remove(ClassShow)
            FormInput[0].classList.remove(ClassBorderAlert)
            FormInput[1].classList.remove(ClassBorderAlert)
            return true;
        }
    }
}



