/**
 * VARIABLES
 **/

var gen_count = 0;
var $config_inputs = $("#pass_gen input");
var history_context = "#history";
var $history = $(history_context);
var $history_list = $(".list-group", history_context);
var $gen_btn = $("#pass_gen_btn");
var $pass_input = $("#pass_input");
var $pass_copy = $("#pass_copy");
var $length_indicator = $("#length_indicator");
var ratings_context = ".ratings";
var $all_ratings = $(".badge", ratings_context);
var $strong_rating = $(".strong.badge", ratings_context);
var $good_rating = $(".good.badge", ratings_context);
var $very_good_rating = $(".very-good.badge", ratings_context);
var $weak_rating = $(".weak.badge", ratings_context);
var password_config = {
  pass_length: 32,
  lowercase: true,
  numbers: true,
  symbols: true,
  uppercase: true,
};

/**
 * FUNCTIONS
 **/

function copyPassword(element_id) {
  /* Get the text field */
  var $copyInput = document.getElementById(element_id);

  if (!$copyInput || !$copyInput.value) {
    console.error("Something went wrong. No value to paste.");
    return false;
  }

  /* Select the text field */
  $copyInput.select();
  $copyInput.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Flash confirmation */
  $copyInput.classList.add("copy-confirmation");

  /* Hide confirmation */
  setTimeout(function () {
    $copyInput.classList.remove("copy-confirmation");
  }, 500);
}

function gradePassword() {
  var password_grade = 100;
  var pass_length = password_config.pass_length;
  var pass_has_lower = password_config.lowercase;
  var pass_has_upper = password_config.uppercase;
  var pass_has_num = password_config.numbers;
  var pass_has_sym = password_config.symbols;
  
  // reveal primary "copy" button when needed
  if (gen_count === 0) {
    $pass_copy.removeClass("d-none");
  }

  // first adjust by length
  if (pass_length < 32) {
    password_grade = 98;
  }

  if (pass_length < 16) {
    password_grade = 88;
  }

  if (pass_length < 12) {
    password_grade = 80;
  }

  if (pass_length < 8) {
    password_grade = 59;
  }

  if (!pass_has_lower) {
    password_grade -= 5;
  }

  if (!pass_has_upper) {
    password_grade -= 5;
  }

  if (!pass_has_num) {
    password_grade -= 7;
  }

  if (!pass_has_sym) {
    password_grade -= 7;
  }

  renderBadges(password_grade);
}

function renderBadges(password_grade) {
  if (password_grade > 98) {
    $strong_rating.removeClass("d-none");
  } else if (password_grade > 84) {
    $very_good_rating.removeClass("d-none");
  } else if (password_grade > 70 && password_grade < 85) {
    $good_rating.removeClass("d-none");
  } else {
    $weak_rating.removeClass("d-none");
  }
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  var symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function generatePassword() {
  var generatedPassword = "";
  var lower = password_config.lowercase;
  var upper = password_config.uppercase;
  var number = password_config.numbers;
  var symbol = password_config.symbols;
  var length = password_config.pass_length;
  var typesCount = lower + upper + number + symbol;
  var typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );
  var randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
  };

  // hide all rating badges
  $all_ratings.addClass("d-none");

  if (typesCount == 0) {
    $pass_input.val("");
    return false;
  }

  // start history
  if (gen_count > 0) {
    $history.removeClass("d-none");
    $history_list.prepend(
      '<li class="list-group-item d-flex justify-content-between flex-column">' + 
      '<input class="form-control form-control-sm pass-name" type="text" placeholder="Name it ...">' +
      '<div class="d-flex mt-1">' +
       '<input id="old-pass-' +
        gen_count +
        '" class="form-control pass-input" type="text" value="' +
        $pass_input.val() +
        '" readonly><button type="button" class="btn btn-info btn-sm ml-md-3 history-copy" data-input="old-pass-' +
        gen_count +
        '">Copy</button>' + 
        '<div>' +
        '</li>'
    );
  }

  // create a loop
  for (var i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  var finalPassword = generatedPassword.slice(0, length);
  $pass_input.val(finalPassword);

  // grade it!
  gradePassword();

  // record count hit
  gen_count++;

  return false;
}

function configChange() {
  var $this = $(this);
  var value = $this.val();
  var property = $this.prop("id");
  var new_value = $this.prop("checked");

  if (property == "pass_length") {
    new_value = parseInt(value);
    $length_indicator.text(value);
  }

  password_config[property] = new_value;
  return false;
}

/**
 * CHANGE
 **/

$config_inputs.change(configChange);

/**
 * CLICK
 **/

$gen_btn.click(generatePassword);

$pass_copy.click(function () {
  copyPassword("pass_input");
});

$("body").on("click", ".history-copy", function () {
  var input_id = $(this).data("input");
  copyPassword(input_id);
});
//# sourceMappingURL=index.js.map
