let element = document.createElement("p");
element.style.position = "absolute";
element.style.margin = "0";
element.style.inset = "0 auto auto 0";
element.style.color = "white";
element.textContent = `dpi ${window.devicePixelRatio}`;
document.body.appendChild(element);


document.documentElement.style.setProperty("--dpi", `${window.devicePixelRatio}px`);

let gBorderGap = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--global-border-gap"));
document.documentElement.style.setProperty("--global-border-gap", `${gBorderGap * window.devicePixelRatio}px`);

let gBorderWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--global-border-width"));
document.documentElement.style.setProperty("--global-border-width", `${gBorderWidth * window.devicePixelRatio}px`);

let gFontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("font-size"));
document.documentElement.style.setProperty("font-size", `${gFontSize * window.devicePixelRatio}px`);

element = document.createElement("p");
element.style.position = "absolute";
element.style.margin = "0";
element.style.inset = "1em auto auto 0";
element.style.color = "white";
element.textContent = `font size ${gFontSize}`;
document.body.appendChild(element);

element = document.createElement("p");
element.style.position = "absolute";
element.style.margin = "0";
element.style.inset = "2em auto auto 0";
element.style.color = "white";
element.textContent = `new font size ${gFontSize * window.devicePixelRatio}`;
document.body.appendChild(element);

element = document.createElement("p");
element.style.position = "absolute";
element.style.margin = "0";
element.style.inset = "3em auto auto 0";
element.style.color = "white";
element.textContent = `actual font size ${parseInt(getComputedStyle(document.documentElement).getPropertyValue("font-size"))}`;
document.body.appendChild(element);


/*
  calc poly wapper shape
*/
(function () {
	const shapes = document.getElementsByClassName("poly-parallelogram");
	for (const shape of shapes) {
		const thickness = parseInt(getComputedStyle(shape).getPropertyValue("--border-width"));
		const isVertical = shape.classList.contains("vertical");

		const rawH = shape.children[0].offsetHeight;
		const rawW = shape.children[0].offsetWidth;

		if (isVertical) {

			/*
	  
				 /| C
				/ |
			   /  |
			D /   / B
			  |  /
			  | /
			A |/
	  
			*/

			//dimentions of exterior triangle on both sides of the polygon
			const h = parseInt(rawW);
			const w = parseInt(rawH);
			const hypotenuse = Math.sqrt((Math.pow(h, 2) + Math.pow((w * 0.25), 2)));

			//dimentions of proportionally smaller triangles at the corners used to calculate the inner polygon
			const p = ((w * 0.25) * thickness) / h;
			const r = (hypotenuse * thickness) / h;

			//points within the larger polygon 
			const innerD = [thickness,
				(rawH * 0.25) - (p - r)];
			const innerC = [(rawW) - thickness,
				(p + r)];
			const innerB = [(rawW) - thickness,
				(rawH * 0.75) + (p - r)];
			const innerA = [thickness,
				(rawH) - (p + r)];

			shape.style.setProperty("--clip",
				`polygon(0 25%, 
				0 100%, 
				${innerB[0]}px ${innerB[1]}px, 
				${innerA[0]}px ${innerA[1]}px,
				${innerD[0]}px ${innerD[1]}px, 
				${innerC[0]}px ${innerC[1]}px,
				${innerB[0]}px ${innerB[1]}px,
				0 100%, 
				100% 75%, 
				100% 0%)`);

			shape.style.setProperty("--clip-outer", `polygon(0 ${rawH * 0.25}px, ${rawW}px 0, ${rawW}px ${rawH * 0.75}px, 0 ${rawH}px)`);//"polygon(0 25%, 100% 0%, 100% 75%, 0% 100%)");
			shape.style.setProperty("--clip-inner",
				`polygon(${innerD[0]}px ${innerD[1]}px, ${innerC[0]}px ${innerC[1]}px, ${innerB[0]}px ${innerB[1]}px, ${innerA[0]}px ${innerA[1]}px)`);
		} else {

			/*
	  
			  D  --------- C
				/       /
			   /       /
			A --------- B
		    
			*/

			//dimentions of exterior triangle on both sides of the polygon
			const h = parseInt(rawH);
			const w = parseInt(rawW);
			const hypotenuse = Math.sqrt((Math.pow(h, 2) + Math.pow((w * 0.25), 2)));

			//dimentions of proportionally smaller triangles at the corners used to calculate the inner polygon
			const p = ((w * 0.25) * thickness) / h;
			const r = (hypotenuse * thickness) / h;

			//points within the larger polygon 
			const innerD = [(rawW * 0.25) - (p - r),
				thickness];
			const innerC = [(rawW) - (p + r),
				thickness];
			const innerB = [(rawW * 0.75) + (p - r),
				(rawH) - thickness];
			const innerA = [p + r,
				(rawH) - thickness];

			shape.style.setProperty("--clip",
				`polygon(25% 0,
				0% 100%,
				${r}px 100%,
				${innerD[0]}px ${innerD[1]}px,
				${innerC[0]}px ${innerC[1]}px,
				${innerB[0]}px ${innerB[1]}px,
				${innerA[0]}px ${innerA[1]}px,
				${r}px 100%,
				75% 100%,
				100% 0%)`);

			shape.style.setProperty("--clip-outer", `polygon(${rawW * 0.25}px 0, ${rawW}px 0, ${rawW * 0.75}px ${rawH}px, 0 ${rawH}px)`);//"polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)");
			shape.style.setProperty("--clip-inner",
				`polygon(${innerD[0]}px ${innerD[1]}px, ${innerC[0]}px ${innerC[1]}px, ${innerB[0]}px ${innerB[1]}px, ${innerA[0]}px ${innerA[1]}px)`);
		}
	}
})();


/*
  gather selector groups and section groups
  pair selectors with their sections

  selectors - radio inputs that set the active section
	wrapper element with name="selector-group" and data-selector-group="group-name"
	each radio input has value="x" and name="group-name-selector"

  sections - section elements that are toggled by selectors
	wrapper element with name="section-group" and data-selector-group="group-name"
	each section has data-value="x"

  groups define which selectors are tied to which sections
  value="x" and data-value="x" use 'x' to define which input will activate which section

*/
(function () {
	const selectorGroups = document.querySelectorAll("[name='selector-group']");
	const sectionGroups = document.querySelectorAll("[name='section-group']");

	for (const selectorGroup of selectorGroups) {
		const groupName = selectorGroup.getAttribute("data-selector-group");
		const sectionGroupMatch = Array.from(sectionGroups).find((element) => element.getAttribute("data-selector-group") == groupName);
		if (sectionGroupMatch) {
			sectionGroupMatch.setAttribute("data-active-section", 1);

			selectorGroup.querySelectorAll(`input[name='${groupName}-selector']`).forEach((selector) => {
				selector.checked = (selector.value == 1);
				SetUpSelectorInput(sectionGroupMatch, selector);
			});

			UpdateSectionGroup(sectionGroupMatch);
		}
	}
})();

function SetUpSelectorInput(sectionGroup, selector) {
	selector.addEventListener("change", function () {
		if (selector.checked) {
			sectionGroup.setAttribute("data-active-section", selector.value);
			UpdateSectionGroup(sectionGroup);
		}
	});
}
function UpdateSectionGroup(sectionGroup) {
	const sections = sectionGroup.querySelectorAll(`[data-selector-group='${sectionGroup.getAttribute("data-selector-group")}'] > section`);

	for (const sec of sections) {
		if (sec.getAttribute("data-value") != sectionGroup.getAttribute("data-active-section")) {
			sec.style.display = "none";
		}
		else {
			sec.style.display = "inline-block";
		}
	}
}



/*
  calc poly clip
*/
(function () {
	const shapes = document.getElementsByClassName("poly-clip");
	for (const shape of shapes) {
		const thickness = parseInt(getComputedStyle(shape).getPropertyValue("--border-width"));
		const triW = parseInt(getComputedStyle(shape).getPropertyValue("--corner-width"));
		const sides = shape.getAttribute("data-clip-sides");
		
		const rawH = shape.offsetHeight;
		const rawW = shape.offsetWidth;

		if(!sides){
			const h = parseInt(rawH);
			const w = parseInt(rawW);
			shape.style.setProperty("--clip", 
				`polygon(0 0, 0 100%, 100% 100%, 100% 0,
				${w - thickness}px 0, ${w - thickness}px ${h - thickness}px, ${thickness}px ${h - thickness}px, ${thickness}px ${thickness}px,
				${w - thickness}px ${thickness}px, ${w - thickness}px 0)`);
			shape.style.setProperty("--clip-outer", 
				"polygon(0 0, 0 100%, 100% 100%, 100% 0)");
			shape.style.setProperty("--clip-inner", 
				`polygon(${thickness}px ${thickness}px, ${thickness}px ${h - thickness}px, ${w - thickness}px ${h - thickness}px, ${w - thickness}px ${thickness}px)`);
			
			return;
		}

		if(sides.includes("left")){
		/*
	  
			  D  --------- C
				/       /
			   /       /
			A --------- B
		    
		*/

			//dimentions of exterior triangle on both sides of the polygon
			const h = parseInt(rawH);
			const w = parseInt(rawW);
			const hypotenuse = Math.sqrt((Math.pow(h, 2) + Math.pow(triW, 2)));

			//dimentions of proportionally smaller triangles at the corners used to calculate the inner polygon
			const p = (triW * thickness) / h;
			const r = (hypotenuse * thickness) / h;

			//points within the larger polygon 
			const innerD = [triW - (p - r),
				thickness];
			const innerC = [(rawW) - (p + r),
				thickness];
			const innerB = [(rawW - triW) + (p - r),
				(rawH) - thickness];
			const innerA = [p + r,
				(rawH) - thickness];
			
			shape.style.setProperty("--clip",
					`polygon(0 0,
					${triW}px 100%,
					100% 100%,
					${w - thickness}px ${h - thickness}px,
					${innerD[0]}px ${h - thickness}px,
					${innerA[0]}px ${thickness}px,
					${w - thickness}px ${thickness}px,
					${w - thickness}px ${h - thickness}px,
					100% 100%,
					100% 0%)`);

			shape.style.setProperty("--clip-outer", 
				`polygon(0 0, ${triW}px 100%, 100% 100%, 100% 0%)`);
			shape.style.setProperty("--clip-inner",
				`polygon(${w - thickness}px ${h - thickness}px, ${innerD[0]}px ${h - thickness}px, ${innerA[0]}px ${thickness}px, ${w - thickness}px ${thickness}px, ${w - thickness}px ${h - thickness}px)`);
		}else if(sides.includes("top")){
			/*
	  
				 /| C
				/ |
			   /  |
			D /   / B
			  |  /
			  | /
			A |/
	  
			*/

			//dimentions of exterior triangle on both sides of the polygon
			const h = parseInt(rawW);
			const w = parseInt(rawH);
			const hypotenuse = Math.sqrt((Math.pow(h, 2) + Math.pow(triW, 2)));

			//dimentions of proportionally smaller triangles at the corners used to calculate the inner polygon
			const p = (triW * thickness) / h;
			const r = (hypotenuse * thickness) / h;

			//points within the larger polygon 
			const innerD = [thickness,
				(triW) - (p - r)];
			const innerC = [(rawW) - thickness,
				(p + r)];
			const innerB = [(rawW) - thickness,
				(rawH - triW) + (p - r)];
			const innerA = [thickness,
				(rawH) - (p + r)];
			

			shape.style.setProperty("--clip",
				`polygon(0 0, 
				0 100%, 
				100% 100%,
				${rawW - thickness}px ${rawH - thickness}px,
				${thickness}px ${rawH - thickness}px,
				${thickness}px ${innerC[1]}px,
				${rawW - thickness}px ${innerD[1]}px,
				${rawW - thickness}px ${rawH - thickness}px,
				100% 100%,
				100% ${innerD[1]}px
				)`);

			shape.style.setProperty("--clip-outer", 
				`polygon(0 0, 0 100%, 100% 100%, 100% ${innerD[1]}px)`);
			shape.style.setProperty("--clip-inner",
				`polygon(${thickness}px ${innerC[1]}px, 
				${thickness}px ${rawH - thickness}px, 
				${rawW - thickness}px ${rawH - thickness}px, 
				${rawW - thickness}px ${innerD[1]}px)`);
		}
	}
})();

/*
  QR Button
*/
(function () {
	let button = document.getElementById("QR-button");
	let overlay = document.getElementById("QR-overlay");
	button.addEventListener("click", function(){
		if (button.classList.contains("alt")){
			button.classList.remove("alt");
			overlay.style.display = "none";
		}else{
			button.classList.add("alt");
			overlay.style.display = "flex";
		}
	});
})();

/*
  auto scrolling text
*/
function enableScroll(scrollContainer, step = -0.1, updateFrequency = 0){
	let scrollContent = scrollContainer.querySelector(".auto-scroll-content");
	
	function scroll(){
		if(step < 0){
			scrollContent.style.left = (parseFloat(window.getComputedStyle(scrollContent).left) + step).toString() + "px";
			if(scrollContent.firstElementChild.getBoundingClientRect().right < scrollContainer.getBoundingClientRect().left){
				scrollContent.appendChild(scrollContent.firstElementChild);
				scrollContent.style.left = "";// resets pos to start
			}
		}else{
			scrollContent.style.right = (parseFloat(window.getComputedStyle(scrollContent).right) - step).toString() + "px";
			if(scrollContent.lastElementChild.getBoundingClientRect().left > scrollContainer.getBoundingClientRect().right){
				scrollContent.prepend(scrollContent.lastElementChild);
				scrollContent.style.right = (scrollContent.offsetWidth - scrollContainer.offsetWidth).toString() + "px";
			}
		}
	}

	if(scrollContent && scrollContainer){
		let stepOverride = scrollContainer.getAttribute("data-scroll-step");
		if(stepOverride){ step = parseFloat(stepOverride); }
		let updateOverride = scrollContainer.getAttribute("data-scroll-update");
		if(updateOverride){ updateFrequency = parseFloat(updateOverride); }

		if(step > 0){
			scrollContent.style.right = (scrollContent.offsetWidth - scrollContainer.offsetWidth).toString() + "px";
		}
		setInterval(scroll, updateFrequency);
	}
}

let scrolls = document.querySelectorAll(".auto-scroll-container");
for(const scroll of scrolls){
	enableScroll(scroll);
}
