var captcha;

		function generateCaptcha() {
			debugger;
			var a = Math.floor((Math.random() * 10));
			var b = Math.floor((Math.random() * 10));
			var c = Math.floor((Math.random() * 10));
			var d = Math.floor((Math.random() * 10));
			var e = Math.floor((Math.random() * 10));
			var f = Math.floor((Math.random() * 10));

			captcha = a.toString() + b.toString() + c.toString() + d.toString()
			          +e.toString()+f.toString();

			document.getElementById("output").innerHTML = captcha;
			debugger;
		}

		function check() {
			var input = document.getElementById("inputText").value;

			if (input == captcha) {
				alert("Equal");
			} else {
				alert("Not Equal");
			}
		}