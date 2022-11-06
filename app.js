let controller;
let slideScene;
let pageScene;
let detailScene;

// Vars
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
const logo = document.querySelector("#logo");
// Listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

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
		const slideTl = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" } });
		slideTl.fromTo(revealImg, { x: "0" }, { x: "100%" });
		slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
		slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
		slideTl.fromTo(nav, { y: "-70%" }, { y: "0%" }, "-=0.75");
		// Create the Scene
		slideScene = new ScrollMagic.Scene({
			triggerElement: slide,
			triggerHook: 0.25,
			reverse: false,
		})
			.setTween(slideTl)
			// .addIndicators({
			// 	colorStart: "white",
			// 	colorTrigger: "white",
			// 	name: "slide",
			// })
			.addTo(controller);
		// New animation
		const pageTl = gsap.timeline();
		// Checking if it's the last element or not
		let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
		pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });

		pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
		pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
		// New sceene
		pageScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: "100%",
			triggerHook: 0,
		})
			// .addIndicators({
			// 	colorStart: "white",
			// 	colorTrigger: "white",
			// 	name: "page",
			// 	indent: 200,
			// })

			//{ pushFollowers: false } helps get rid of the empty space and start the nast slide animation
			.setPin(slide, { pushFollowers: false })
			.setTween(pageTl)
			.addTo(controller);
	});
}

function cursor(e) {
	mouse.style.top = e.pageY + "px";
	mouse.style.left = e.pageX + "px";
}
function activeCursor(e) {
	const item = e.target;
	if (item.id === "logo" || item.classList.contains("burger")) {
		mouse.classList.add("nav-active");
	} else {
		mouse.classList.remove("nav-active");
	}
	if (item.classList.contains("explore")) {
		mouse.classList.add("explore-active");
		// Hover effect for title
		gsap.to(".title-swipe", 1, { y: "0%" });
		mouseTxt.innerText = "Tap";
		mouseTxt.style.fontWeight = "400";
		mouseTxt.style.paddingBottom = "10px";
	} else {
		mouse.classList.remove("explore-active");
		mouseTxt.innerText = "";
		// Hover effect for title
		gsap.to(".title-swipe", 1, { y: "100%" });
	}
}
function navToggle(e) {
	if (!e.target.classList.contains("active")) {
		e.target.classList.add("active");
		gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
		gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
		gsap.to("#logo", 1, { color: "black" });
		gsap.to(".nav-bar", 1, { clipPath: "circle(3500px at 100% -10%)" });
		document.body.classList.add("hide");
	} else {
		e.target.classList.remove("active");
		gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
		gsap.to("#logo", 1, { color: "white" });
		gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
		document.body.classList.remove("hide");
	}
}
//  Barba page transitions
barba.init({
	views: [
		{
			namespace: "home",
			beforeEnter() {
				animateSlides();
				logo.href = "./index.html";
			},
			beforeLeave() {
				slideScene.destroy();
				pageScene.destroy();
				controller.destroy();
			},
		},
		{
			namespace: "fashion",
			beforeEnter() {
				logo.href = "../index.html";
				detailAnimation();
				gsap.fromTo(".nav-header", 2, { y: "-100%" }, { y: "0%", ease: "power2.inOut" });
			},
			beforeLeave() {
				controller.destroy();
				detailScene.destroy();
			},
		},
	],
	transitions: [
		{
			leave({ current, next }) {
				let done = this.async();
				// Scroll to the top
				window.scrollTo(0, 0);
				// Animation
				const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
				tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
				tl.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%", onComplete: done }, "-=1");
			},
			enter({ current, next }) {
				let done = this.async();
				const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
				tl.fromTo(".swipe", 0.75, { x: "0%" }, { x: "100%", stagger: 0.15, onComplete: done });
				tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
				tl.fromTo(".nav-header", 1.5, { y: "-80%" }, { y: "0%", ease: "power2.inOut" }, "-=1.5");
			},
		},
	],
});

function detailAnimation() {
	controller = new ScrollMagic.Controller();
	const slides = document.querySelectorAll(".detail-slide");
	slides.forEach((slide, index, slides) => {
		const slideTl = gsap.timeline({ defaults: { duration: 1 } });
		let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
		const nextImg = nextSlide.querySelector("img");
		slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
		slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=-1");
		slideTl.fromTo(nextImg, { opacity: 0, x: "70%" }, { opacity: 1, x: "0" });
		// Create scene
		detailScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: "100%",
			triggerHook: 0,
		})
			.setPin(slide, { pushFollowers: false })
			.setTween(slideTl)
			.addTo(controller);
		// .addIndicators({ colorStart: "white", colorTrigger: "white", name: "detailScene", indent: 200 });
	});
}
