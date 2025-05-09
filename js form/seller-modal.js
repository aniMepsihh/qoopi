document.addEventListener('DOMContentLoaded', function () {
  // Элементы модального окна
  const sellerModal = document.getElementById('sellerModal');
  const openSellerModalBtn = document.querySelector('#openSellerModalBtn');
  const closeSellerModalBtn = document.getElementById('closeSellerModalBtn');
  const sellerForm = document.getElementById('seller-form');
  const submitSellerBtn = document.getElementById('submitSellerBtn');
  const modalContainer = sellerModal.querySelector('.modal-container');
  const formAlert = document.getElementById('seller-form-alert');
  const burgerBtn = document.querySelector('#burgerBtn');

  // Анимационные параметры
  const ANIMATION_DURATION = 300;
  let isAnimating = false;

  // Инициализация при загрузке
  initMultiSelect();
  initPhoneMask();
  setupEventListeners();

  // Класс для управления мультиселектом
  class MultiSelect {
    constructor(container) {
      this.container = container;
      this.header = container.querySelector('.dropdown-header');
      this.optionsContainer = container.querySelector('.dropdown-options');
      this.selectedText = container.querySelector('.selected-text');
      this.checkboxes = container.querySelectorAll('.option-checkbox');

      this.init();
    }

    init() {
      // Обработчик клика по заголовку
      this.header.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Обработчики для опций
      this.optionsContainer.querySelectorAll('.option').forEach((option) => {
        option.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const checkbox = option.querySelector('.option-checkbox');
            checkbox.checked = !checkbox.checked;
            this.updateSelectedText();
            this.resetErrorState(); // Сброс ошибки при изменении выбора
          }
        });
      });

      // Обработчики изменений чекбоксов
      this.checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          this.updateSelectedText();
          this.resetErrorState(); // Сброс ошибки при изменении выбора
        });
      });

      // Закрытие при клике вне элемента
      document.addEventListener('click', () => {
        this.close();
      });

      this.updateSelectedText();
    }

    toggle() {
      this.container.classList.toggle('open');
    }

    open() {
      this.container.classList.add('open');
    }

    close() {
      this.container.classList.remove('open');
    }

    updateSelectedText() {
      const selectedOptions = Array.from(this.checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.nextElementSibling.textContent);

      if (selectedOptions.length === 0) {
        this.selectedText.innerHTML =
          '<span class="placeholder">Выберите категории</span>';
        this.selectedText.style.color = '#8a8a8a';
      } else {
        this.selectedText.innerHTML = selectedOptions
          .map(
            (text) =>
              `<span class="tag">${text}<span class="remove-tag">×</span></span>`
          )
          .join('');
        this.selectedText.style.color = '#ffffff';

        // Добавляем обработчики для кнопок удаления
        this.selectedText.querySelectorAll('.remove-tag').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const optionText = btn.parentElement.textContent
              .replace('×', '')
              .trim();
            const checkbox = [...this.checkboxes].find(
              (cb) => cb.nextElementSibling.textContent === optionText
            );
            if (checkbox) {
              checkbox.checked = false;
              this.updateSelectedText();
              this.resetErrorState(); // Сброс ошибки при изменении выбора
            }
          });
        });
      }
    }

    getSelectedValues() {
      return Array.from(this.checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.parentElement.dataset.value);
    }

    reset() {
      this.checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      this.updateSelectedText();
      this.resetErrorState();
    }

    resetErrorState() {
      this.container.classList.remove('error');
      this.header.style.borderBottomColor = '#515151';
      this.selectedText.style.color = this.checkboxes.some((cb) => cb.checked)
        ? '#ffffff'
        : '#8a8a8a';
    }
  }

  // Инициализация мультиселекта
  function initMultiSelect() {
    const multiSelectContainer = document.querySelector(
      '.multiselect-dropdown'
    );
    if (multiSelectContainer) {
      window.sellerMultiSelect = new MultiSelect(multiSelectContainer);
    }
  }

  // Функция открытия модального окна
  function openSellerModal() {
    if (isAnimating) return;
    isAnimating = true;
    burgerBtn.style.display = 'none'
    sellerModal.style.display = 'flex';
    sellerModal.style.opacity = '0';
    modalContainer.style.transform = 'translateY(20px)';
    modalContainer.style.opacity = '0';

    requestAnimationFrame(() => {
      sellerModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
      modalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;

      sellerModal.style.opacity = '1';
      modalContainer.style.transform = 'translateY(0)';
      modalContainer.style.opacity = '1';

      setTimeout(() => {
        isAnimating = false;
        sellerModal.classList.add('active');
      }, 20);
    });

    resetFormState();
    document.body.style.overflow = 'hidden';
  }

  // Функция плавного закрытия
  function closeSellerModal() {
    if (isAnimating) return;
    isAnimating = true;

    sellerModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
    modalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;
    sellerModal.style.opacity = '0';
    modalContainer.style.transform = 'translateY(20px)';
    modalContainer.style.opacity = '0';

    setTimeout(() => {
      burgerBtn.style.display = 'flex'
    }, 100);
    setTimeout(() => {
      sellerModal.style.display = 'none';
      document.body.style.overflow = '';
      sellerModal.classList.remove('active');
      sellerModal.style.transition = '';
      modalContainer.style.transition = '';
      isAnimating = false;

      if (window.sellerMultiSelect) {
        window.sellerMultiSelect.close();
      }
    }, ANIMATION_DURATION);
  }

  // Маска для телефона
  function initPhoneMask() {
    const phoneInput = document.getElementById('sellerPhone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
      let x = e.target.value
        .replace(/\D/g, '')
        .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      e.target.value = !x[2]
        ? '+7'
        : `+7 (${x[2]}${x[3] ? `) ${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}${
            x[5] ? `-${x[5]}` : ''
          }`;
    });
  }

  // Обработчик отправки формы
  function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      companyName: document.getElementById('companyName').value,
      productCategories: window.sellerMultiSelect
        ? window.sellerMultiSelect.getSelectedValues()
        : [],
      marketplaceLink: document.getElementById('marketplaceLink').value,
      sellerName: document.getElementById('sellerName').value,
      sellerEmail: document.getElementById('sellerEmail').value,
      sellerPhone: document.getElementById('sellerPhone').value,
      agreement: document.getElementById('sellerAgreement').checked,
      newsletter: document.getElementById('sellerNewsletter').checked,
    };

    if (validateForm(formData)) {
      console.log('Form data:', formData);
      closeSellerModal();
      setTimeout(openSuccessModal, ANIMATION_DURATION + 50);
    }
  }

  // Валидация формы
  function validateForm(formData) {
    let isValid = true;

    // Сброс предыдущих ошибок
    resetErrorStates();

    // Проверка обязательных полей
    const requiredFields = [
      'companyName',
      'marketplaceLink',
      'sellerName',
      'sellerEmail',
      'sellerPhone',
    ];

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (
        !formData[fieldId] ||
        formData[fieldId].trim() === '' ||
        (fieldId === 'marketplaceLink' && formData[fieldId] === 'https://')
      ) {
        markFieldAsError(field);
        isValid = false;
      }
    });

    // Проверка категорий
    if (
      !formData.productCategories ||
      formData.productCategories.length === 0
    ) {
      const multiselect = document.querySelector('.multiselect-dropdown');
      if (multiselect) {
        multiselect.classList.add('error');
        multiselect.querySelector('.dropdown-header').style.borderBottomColor =
          '#ff3b30';
        multiselect.querySelector('.selected-text').style.color = '#ff3b30';
      }
      isValid = false;
    }

    // Проверка email
    if (formData.sellerEmail && !validateEmail(formData.sellerEmail)) {
      markFieldAsError(document.getElementById('sellerEmail'));
      isValid = false;
    }

    // Проверка телефона
    if (formData.sellerPhone && formData.sellerPhone.length < 5) {
      markFieldAsError(document.getElementById('sellerPhone'));
      isValid = false;
    }

    // Проверка соглашения
    if (!formData.agreement) {
      const agreementGroup = document
        .getElementById('sellerAgreement')
        .closest('.checkbox-group');
      agreementGroup.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      showFormAlert();
      scrollToFirstError();
    }

    return isValid;
  }

  // Пометить поле как ошибочное
  function markFieldAsError(field) {
    field.classList.add('error-field');
    field.style.color = '#ff3b30';
    field.style.borderBottomColor = '#ff3b30';
  }

  // Сбросить состояния ошибок
  function resetErrorStates() {
    // Сброс ошибок полей ввода
    document.querySelectorAll('.error-field').forEach((field) => {
      field.classList.remove('error-field');
      field.style.color = '#ffffff'; // Возвращаем стандартный цвет текста
      field.style.borderBottomColor = '#515151'; // Возвращаем стандартный цвет границы
    });

    // Сброс ошибок мультиселекта
    document.querySelectorAll('.multiselect-dropdown').forEach((ms) => {
      ms.classList.remove('error');
      const header = ms.querySelector('.dropdown-header');
      if (header) {
        header.style.borderBottomColor = '#515151';
      }
      const selectedText = ms.querySelector('.selected-text');
      if (selectedText) {
        const hasSelection = ms.querySelector('.option-checkbox:checked');
        selectedText.style.color = hasSelection ? '#ffffff' : '#8a8a8a';
      }
    });

    // Сброс ошибок чекбоксов
    document.querySelectorAll('.checkbox-group.error').forEach((group) => {
      group.classList.remove('error');
    });

    // Скрываем сообщение об ошибке
    if (formAlert) {
      formAlert.style.display = 'none';
    }
  }

  // Показать сообщение об ошибке формы
  function showFormAlert() {
    if (formAlert) {
      formAlert.style.display = 'flex';
      formAlert.style.animation = 'none';
      void formAlert.offsetWidth; // Trigger reflow
      formAlert.style.animation = 'shake 0.5s ease';
    }
  }

  // Прокрутить к первой ошибке
  function scrollToFirstError() {
    const firstError = document.querySelector(
      '.error-field, .error, .checkbox-group.error'
    );
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Валидация email
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Открытие модального окна успеха
  function openSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.style.display = 'flex';
      setTimeout(() => {
        successModal.style.opacity = '1';
      }, 20);
    }
  }

  // Сброс состояния формы
  function resetFormState() {
    if (sellerForm) {
      sellerForm.reset();
      document.getElementById('sellerAgreement').checked = false;
      document.getElementById('sellerNewsletter').checked = false;

      // Сброс мультиселекта
      if (window.sellerMultiSelect) {
        window.sellerMultiSelect.reset();
      }

      // Сброс ошибок
      resetErrorStates();
    }
  }

  // Настройка обработчиков событий
  function setupEventListeners() {
    openSellerModalBtn.addEventListener('click', openSellerModal);
    closeSellerModalBtn.addEventListener('click', closeSellerModal);
    submitSellerBtn.addEventListener('click', handleSubmit);

    sellerModal.addEventListener('click', function (e) {
      if (e.target === sellerModal) closeSellerModal();
    });

    modalContainer.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sellerModal.classList.contains('active')) {
        closeSellerModal();
      }
    });

    // Сброс ошибок при изменении полей
    document.querySelectorAll('#seller-form input').forEach((input) => {
      input.addEventListener('input', function () {
        if (this.classList.contains('error-field')) {
          this.classList.remove('error-field');
          this.style.color = '#ffffff';
          this.style.borderBottomColor = '#515151';
        }
      });
    });
  }
});
