let controller;
let slideScene;
let pageScene;
// Listeners
window.addEventListener("mousemove", cursorAnimation);

function animateSlides() {
	// Init controller
	controller = new ScrollMagic.Controller();
	// Selecting some things
	const sliders = document.querySelectorAll(".slide");
	const nav = document.querySelector(".nav-header");

	// Loop over each slide

	sliders.forEach((slide, index, slides) => {
		const revealImg = slide.querySelector(".reveal-img");
		const img = slide.querySelector("img");
		const revealText = slide.querySelector(".reveal-text");
		// GSAP
		const timeline1 = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" } });
		timeline1.fromTo(revealImg, { x: "0" }, { x: "100%" });
		timeline1.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
		timeline1.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
		timeline1.fromTo(nav, { y: "-70%" }, { y: "0" }, "-=0.5");
		// Scene
		slideScene = new ScrollMagic.Scene({
			triggerElement: slide,
			triggerHook: 0.25,
			reverse: false,
		})
			.setTween(timeline1)

			.addTo(controller);
		// New animation
		const timeline2 = gsap.timeline();
		// Checking if it's the last element or not
		let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
		timeline2.fromTo(nextSlide, { y: "0%" }, { y: "50%" });

		timeline2.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
		timeline2.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
		// New sceene
		pageScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: "100%",
			triggerHook: 0,
		})

			//{ pushFollowers: false } helps get rid of the empty space and start the nast slide animation
			.setPin(slide, { pushFollowers: false })
			.setTween(timeline2)
			.addTo(controller);
	});
}
function cursorAnimation(e) {
	let mouse = document.querySelector(".cursor");
	mouse.style.top = e.pageY + "px";
	mouse.style.left = e.pageX + "px";
}

animateSlides();
