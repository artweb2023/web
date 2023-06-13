window.onload = () => {
    initializeFormValidation();
    initializeInputEventHandlers();
    initializeAvatarPreview();
    initializeBoxImagePreview();
    initializeCardImagePreview();
    initializeLogout();
};

function initializeFormValidation() {
    const form = document.querySelector("form");
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            getFormValue();
        }
    });

    function validateForm() {
        const ClassNoShow = 'no-show';
        const ClassInputMargin = 'input_margin';
        const ClassInputBorder = 'input_border';
        const ClassTexareaBoreder = 'textareat_accent';
        const ClassAlertAnimation = 'alert_animation';
        const ClassAlertBordet = 'alert-border';
        const ClassAlertRemove = 'hide_animation'
        const alertBlock = document.querySelector('.form-alert');
        const alertMessage = document.querySelectorAll('.form-post__alert');
        const AvatarLable = document.querySelector('.form-post__avatar-lable');
        const BoxLable = document.querySelector('.form-post__box-lable');
        const CarLable = document.querySelector('.form-post__card-lable');
        const title = form.querySelector('[name="title"]');
        const description = form.querySelector('[name="description"]');
        const name = form.querySelector('[name="author"]');
        const date = form.querySelector('[name="date"]');
        const text = form.querySelector('[name="message"]');
        const avatar = form.querySelector('[name="avatar"]');
        const boxImageUpload = form.querySelector('[name="box-img"]');
        const cardImageUpload = form.querySelector('[name="img-card"]');

        title.addEventListener('input', () => {
            alertMessage[0].classList.add(ClassNoShow);
            title.classList.remove(ClassInputBorder);
            title.classList.add(ClassInputMargin);
            alertBlock.classList.add(ClassAlertRemove);
        });

        description.addEventListener('input', () => {
            alertMessage[1].classList.add(ClassNoShow);
            description.classList.remove(ClassInputBorder);
            description.classList.add(ClassInputMargin)
            description.classList.add(ClassInputMargin);
            alertBlock.classList.add(ClassAlertRemove);
        });

        name.addEventListener('input', () => {
            alertMessage[2].classList.add(ClassNoShow);
            name.classList.remove(ClassInputBorder);
            name.classList.add(ClassInputMargin);
            alertBlock.classList.add(ClassAlertRemove);
        });

        date.addEventListener('input', () => {
            alertMessage[3].classList.add(ClassNoShow);
            date.classList.remove(ClassInputBorder);
            date.classList.add(ClassInputMargin);
            alertBlock.classList.add(ClassAlertRemove);
        });

        text.addEventListener('input', () => {
            text.classList.remove(ClassTexareaBoreder);
            alertMessage[4].classList.add(ClassNoShow);
            alertBlock.classList.add(ClassAlertRemove);
        });

        avatar.addEventListener('input', () => {
            AvatarLable.classList.remove(ClassAlertBordet);
            alertBlock.classList.add(ClassNoShow);
        });

        boxImageUpload.addEventListener('input', function () {
            BoxLable.classList.remove(ClassAlertBordet);
            alertBlock.classList.add(ClassAlertRemove);
        });

        cardImageUpload.addEventListener('input', function () {
            CarLable.classList.remove(ClassAlertBordet);
            alertBlock.classList.add(ClassAlertRemove);
        });

        let formValid = true;

        if (title.value == "" || title.length == 0) {
            alertMessage[0].classList.remove(ClassNoShow);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            title.classList.remove(ClassInputMargin);
            title.classList.add(ClassInputBorder);
            formValid = false;
        }

        if (description.value == "" || description.length == 0) {
            alertMessage[1].classList.remove(ClassNoShow);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            description.classList.remove(ClassInputMargin);
            description.classList.add(ClassInputBorder);
            formValid = false;
        }

        if (name.value == "" || name.length == 0) {
            alertMessage[2].classList.remove(ClassNoShow);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            name.classList.remove(ClassInputMargin);
            name.classList.add(ClassInputBorder);
            formValid = false;
        }

        if (date.value == "" || date.length == 0) {
            alertMessage[3].classList.remove(ClassNoShow);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            date.classList.remove(ClassInputMargin);
            date.classList.add(ClassInputBorder);
            formValid = false;
        }

        if (text.value == "" || text.length == 0) {
            alertMessage[4].classList.remove(ClassNoShow);
            text.classList.add(ClassTexareaBoreder);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            formValid = false;
        }

        if (typeof avatar.files[0] === 'undefined') {
            AvatarLable.classList.add(ClassAlertBordet);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            formValid = false;
        }

        if (typeof boxImageUpload.files[0] === 'undefined') {
            BoxLable.classList.add(ClassAlertBordet);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            formValid = false;
        }

        if (typeof cardImageUpload.files[0] === 'undefined') {
            CarLable.classList.add(ClassAlertBordet);
            alertBlock.classList.remove(ClassNoShow);
            alertBlock.classList.add(ClassAlertAnimation);
            formValid = false;
        }

        return formValid;
    }

    async function getFormValue() {
        const ClassNoShow = 'no-show'
        const ClassAlertAnimation = 'complete_animation'
        const FormComplete = document.querySelector(".form-complete")
        const previewAvatar = document.querySelector(".form-post__avatar-image");
        const postBoxPic = document.querySelector(".form-post__box-pic");
        const previewCardImg = document.querySelector(".form-post__card-img");
        const title = form.querySelector('[name="title"]');
        const description = form.querySelector('[name="description"]');
        const name = form.querySelector('[name="author"]');
        const date = form.querySelector('[name="date"]');
        const avatar = previewAvatar.src.slice("data:image/png;base64,".length).replace(',', '');
        const boxImageUpload = postBoxPic.src.slice("data:image/png;base64,".length).replace(',', '');
        const cardImageUpload = previewCardImg.src.slice("data:image/png;base64,".length).replace(',', '');
        const text = form.querySelector('[name="message"]');
        const content = text.value.split("\n\n");

        const Post = {
            title: title.value,
            description: description.value,
            name: name.value,
            avatar: avatar,
            date: date.value,
            boxImage: boxImageUpload,
            content: content
        };

        const response = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(Post)
        });

        if (response.status === 200) {
            FormComplete.classList.remove(ClassNoShow);
            FormComplete.classList.add(ClassAlertAnimation);
        }
    }
}

function initializeInputEventHandlers() {
    const classFocus = 'form-post__input_focus';

    const inputTitle = document.querySelector('.form-post__input[name="title"]');
    const previewBoxTittle = document.querySelector('.form-preview__box-title.text_title');
    const previewCardTitle = document.querySelector('.form-preview__card-title');

    const inputDescription = document.querySelector('.form-post__input[name="description"]');
    const previewBoxDescription = document.querySelector('.form-preview__box-description');
    const previewCardDescription = document.querySelector('.form-preview__card-description');

    const inputAutorName = document.querySelector('.form-post__input[name="author"]');
    const previewCardAutor = document.querySelector('.form-preview__name');

    const inputDate = document.querySelector('.form-post__input[name="date"]');
    const previewCardDate = document.querySelector('.form-preview__date');

    const InputText = document.querySelector('.form-text__textarea');
    const ClassTexareaBoreder = 'textarea_focus';

    inputTitle.addEventListener('input', handleInputChange);
    inputTitle.addEventListener('focus', handleInputFocus);
    inputTitle.addEventListener('blur', handleInputBlur);

    inputDescription.addEventListener('input', handleInputChange);
    inputDescription.addEventListener('focus', handleInputFocus);
    inputDescription.addEventListener('blur', handleInputBlur);

    inputAutorName.addEventListener('input', handleInputChange);
    inputAutorName.addEventListener('focus', handleInputFocus);
    inputAutorName.addEventListener('blur', handleInputBlur);

    inputDate.addEventListener('input', handleInputChange);
    inputDate.addEventListener('focus', handleInputFocus);
    inputDate.addEventListener('blur', handleInputBlur);

    InputText.addEventListener('input', handleInputChange);
    InputText.addEventListener('focus', handleInputFocus);
    InputText.addEventListener('blur', handleInputBlur);

    function handleInputChange(e) {
        const value = e.target.value;
        const truncatedValue = value.length > 20 ? value.substring(0, 20) + '...' : value;

        if (e.target === inputTitle) {
            previewBoxTittle.textContent = truncatedValue;
            previewCardTitle.textContent = truncatedValue;
        } else if (e.target === inputDescription) {
            previewBoxDescription.textContent = truncatedValue;
            previewCardDescription.textContent = truncatedValue;
        } else if (e.target === inputAutorName) {
            previewCardAutor.textContent = truncatedValue;
        } else if (e.target === inputDate) {
            previewCardDate.textContent = truncatedValue;
        }

        const inputField = e.target;
        if (value !== '') {
            inputField.classList.add(classFocus);
        } else {
            inputField.classList.remove(classFocus);
        }

        if (e.target === InputText) {
            if (value !== '') {
                InputText.classList.add(ClassTexareaBoreder);
            } else {
                InputText.classList.remove(ClassTexareaBoreder);
            }
        }
    }

    function handleInputFocus() {
        if (this.value === 'New Post') {
            this.value = '';
        }
    }

    function handleInputBlur() {
        if (this.value === '') {
            if (this === inputTitle) {
                previewBoxTittle.textContent = 'New Post';
                previewCardTitle.textContent = 'New Post';
            } else if (this === inputDescription) {
                previewBoxDescription.textContent = 'Please, enter any description';
                previewCardDescription.textContent = 'Please, enter any description';
            } else if (this === inputAutorName) {
                previewCardAutor.textContent = 'Enter author name';
            } else if (this === inputDate) {
                previewCardDate.textContent = '4/19/2023';
            }
        }
    }
}

function initializeAvatarPreview() {
    const ClassShow = 'show';
    const ClassNoShow = 'no-show';
    const LableBorder = 'lable-border';
    const previewAvatar = document.querySelector(".form-post__avatar-image");
    const ShowAvatar = document.querySelector(".form-preview__avatar");
    const AvatarIcon = document.querySelector(".icon_avatar");
    const ButtonUpload = document.querySelector(".button_avatar_upload");
    const ButtonUpdate = document.querySelector(".button_avatar_update");
    const IconUpdate = document.querySelector(".icon-update");
    const IconRemoce = document.querySelector(".form-post__icon-delete ");
    const ButtonRemove = document.querySelector(".button_avatar_remove");
    const AvatarLable = document.querySelector(".form-post__avatar-lable");

    const AvatarUpload = document.querySelector(".form-post__input-button");
    AvatarUpload.addEventListener('change', previewAvatarFile);

    function previewAvatarFile() {
        const file = AvatarUpload.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            previewAvatar.src = reader.result;
            ShowAvatar.style.background = "url(" + reader.result + ") center/100% 100% no-repeat";
        };

        if (file) {
            reader.readAsDataURL(file);
            previewAvatar.classList.add(ClassShow);
            AvatarIcon.classList.add(ClassNoShow);
            ButtonUpload.classList.add(ClassNoShow);
            ButtonUpdate.classList.remove(ClassNoShow);
            IconUpdate.classList.remove(ClassNoShow);
            IconRemoce.classList.remove(ClassNoShow);
            ButtonRemove.classList.remove(ClassNoShow);
            AvatarLable.classList.remove(LableBorder);
        } else {
            previewAvatar.src = "";
        }
    }

    const ClassPreview = 'preview_avatar_background';
    const ButtonDelete = document.querySelector(".button_avatar_remove");
    ButtonDelete.addEventListener('click', avatarFileRemove);

    function avatarFileRemove() {
        previewAvatar.getAttribute('src');
        previewAvatar.removeAttribute('src');
        ShowAvatar.removeAttribute("style");
        ShowAvatar.classList.add(ClassPreview);
        ButtonUpdate.classList.add(ClassNoShow);
        IconUpdate.classList.add(ClassNoShow);
        IconRemoce.classList.add(ClassNoShow);
        ButtonRemove.classList.add(ClassNoShow);
        AvatarLable.classList.add(LableBorder);
        ButtonUpload.classList.remove(ClassNoShow);
        AvatarIcon.classList.remove(ClassNoShow);
        previewAvatar.classList.remove(ClassShow);
    }

}

function initializeBoxImagePreview() {
    const ClassNoShow = 'no-show';
    const ClassShow = 'show';
    const ClassFlex = 'flex_show';
    const ClassNoFlex = 'flex_no_show';
    const LableBorder = 'lable-border';
    const BoxButton = document.querySelector(".form-post__box-button");
    const postBoxPic = document.querySelector(".form-post__box-pic");
    const postBoxIcon = document.querySelector(".form-post__box-icon");
    const postBoxButton = document.querySelector(".button_box");
    const showBoxImage = document.querySelector(".form-preview__pic");
    const postBox = document.querySelector('.form-post__box-lable');
    const BoxPicUpload = document.querySelectorAll('.form-post__box-input')[0];
    const BoxPicUpdate = document.querySelectorAll('.form-post__box-input')[1];

    BoxPicUpload.addEventListener('change', previewBoxFile);
    BoxPicUpdate.addEventListener('change', previewBoxFile);

    function previewBoxFile(e) {
        const targetElement = e.target;

        const file = targetElement.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            postBoxPic.src = reader.result;
            showBoxImage.style.background = "url(" + reader.result + ") center/100% 100% no-repeat";
        }

        if (file) {
            reader.readAsDataURL(file);
            postBoxPic.classList.remove(ClassNoShow);
            postBoxPic.classList.add(ClassShow);
            postBoxIcon.classList.add(ClassNoShow);
            postBoxButton.classList.add(ClassNoShow);
            BoxButton.classList.remove(ClassNoFlex);
            BoxButton.classList.add(ClassFlex);
            postBox.classList.remove(LableBorder);
        } else {
            postBoxPic.src = "";
        }
    }

    const boxRemoveImage = document.querySelector(".button_box_delete")
    boxRemoveImage.addEventListener('click', boxImageRemove)

    function boxImageRemove() {
        postBoxPic.getAttribute('src');
        postBoxPic.removeAttribute('src');
        showBoxImage.removeAttribute("style");
        postBoxPic.classList.add(ClassNoShow);
        postBoxPic.classList.remove(ClassShow);
        postBoxIcon.classList.remove(ClassNoShow);
        postBoxButton.classList.remove(ClassNoShow);
        BoxButton.classList.add(ClassNoFlex);
        BoxButton.classList.remove(ClassFlex);
        postBox.classList.add(LableBorder);
    }
}

function initializeCardImagePreview() {
    const ClassNoShow = 'no-show';
    const ClassShow = 'show';
    const ClassFlex = 'flex_show';
    const LableBorder = 'lable-border';
    const previewCardImg = document.querySelector(".form-post__card-img");
    const cardIcon = document.querySelector(".form-post__card-icon");
    const cardButtonUpload = document.querySelector(".button_card");
    const cardPostLable = document.querySelector(".form-post__card-lable");
    const cardButtonContainer = document.querySelector(".form-post__card-button");
    const showCardImage = document.querySelector(".form-preview__img");

    const CardUpload = document.querySelectorAll(".form-post__card-input")[0];
    const CardUpdate = document.querySelectorAll(".form-post__card-input")[1];
    CardUpload.addEventListener('change', previewCardFile);
    CardUpdate.addEventListener('change', previewCardFile);

    function previewCardFile(e) {
        const targetElement = e.target;
        const file = targetElement.files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            previewCardImg.src = reader.result;
            showCardImage.style.background = "url(" + reader.result + ") center/100% 100% no-repeat";
        }

        if (file) {
            reader.readAsDataURL(file);
            previewCardImg.classList.remove(ClassNoShow);
            previewCardImg.classList.add(ClassShow);
            cardButtonUpload.classList.add(ClassNoShow);
            cardIcon.classList.add(ClassNoShow);
            cardButtonContainer.classList.remove(ClassNoShow);
            cardButtonContainer.classList.add(ClassFlex);
            cardPostLable.classList.remove(LableBorder);

        } else {
            previewCardImg.src = "";
        }
    }

    const cardRemoveImage = document.querySelector(".button_card_delete");
    cardRemoveImage.addEventListener('click', cardImageRemove);

    function cardImageRemove() {
        previewCardImg.getAttribute('src');
        previewCardImg.removeAttribute('src');
        showCardImage.removeAttribute("style");
        previewCardImg.classList.add(ClassNoShow);
        previewCardImg.classList.remove(ClassShow);
        cardButtonUpload.classList.remove(ClassNoShow);
        cardIcon.classList.remove(ClassNoShow);
        cardButtonContainer.classList.add(ClassNoShow);
        cardButtonContainer.classList.remove(ClassFlex);
        cardPostLable.classList.add(LableBorder);
    }

}

function initializeLogout() {
    const logoutButton = document.querySelector(".header__button")
    logoutButton.addEventListener('click', async () => {
        const response = await fetch('/api/logout')
        if (response.ok) {
            window.location.href = "/home"
        }
    })
}