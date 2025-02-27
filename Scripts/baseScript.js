/*
  calc poly wapper shape
*/
(function () {
	const shapes = document.getElementsByClassName("poly-parallelogram");
	for (const shape of shapes) {
		const thickness = parseInt(getComputedStyle(shape).getPropertyValue("--width"));
		const isVertical = shape.classList.contains("vertical");
		const isDecoration = shape.classList.contains("decorator");

		const rawH = isDecoration ? shape.offsetHeight : shape.children[0].offsetHeight;
		const rawW = isDecoration ? shape.offsetWidth : shape.children[0].offsetWidth;

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
  calc poly tab shape
*/
(function () {
	const shapes = document.querySelectorAll(".tab.poly");
	for (const shape of shapes) {
		const borderThickness = parseInt(getComputedStyle(shape).getPropertyValue("--border-width"));
		const cornerWidth = parseInt(getComputedStyle(shape).getPropertyValue("--corner-width"));

		const h = parseInt(shape.offsetHeight);
		const w = parseInt(shape.offsetWidth);

		const hypotenuse = Math.sqrt((Math.pow(h, 2) + Math.pow(cornerWidth, 2)));
		const p = (cornerWidth * borderThickness) / h;
		const r = (hypotenuse * borderThickness) / h;

		if (shape.classList.contains("clip-bottom")) {
			const innerA = [0, h - borderThickness];
			const innerB = [w - borderThickness, h - cornerWidth + (p - r)];

			shape.style.setProperty("--clip",
				`polygon(0 0,
          0 ${borderThickness}px, 
          ${w - borderThickness}px ${borderThickness}px, 
          ${innerB[0]}px ${innerB[1]}px, 
          ${innerA[0]}px ${innerA[1]}px, 
          0 100%, 
          ${w}px ${h - cornerWidth}px,
          100% 0)`);

			shape.style.setProperty("--clip-outer", `polygon(0 0, 0 100%, ${w}px ${h - cornerWidth}px, 100% 0)`);
			shape.style.setProperty("--clip-inner",
				`polygon(0 ${borderThickness}px, ${w - borderThickness}px ${borderThickness}px, ${innerB[0]}px ${innerB[1]}px, ${innerA[0]}px ${innerA[1]}px)`);

		} else if (shape.classList.contains("clip-top")) {
			const innerA = [0, borderThickness];
			const innerB = [w - borderThickness, cornerWidth - (p - r)];

			shape.style.setProperty("--clip",
				`polygon(0 0,
          ${innerA[0]}px ${innerA[1]}px,
          ${innerB[0]}px ${innerB[1]}px,
          ${w - borderThickness}px ${h - borderThickness}px,
          0 ${h - borderThickness}px,
          0 100%,
          100% 100%,
          100% ${cornerWidth}px)`);

			shape.style.setProperty("--clip-outer", `polygon(0 0, ${w}px ${cornerWidth}px, 100% 100%, 0 100%)`);
			shape.style.setProperty("--clip-inner",
				`polygon(${innerA[0]}px ${innerA[1]}px, ${innerB[0]}px ${innerB[1]}px, ${w - borderThickness}px ${h - borderThickness}px, 0 ${h - borderThickness}px)`);

		} else {
			//const innerA = [(w) - borderThickness, h];
			const innerB = [(w - cornerWidth) + (p - r), borderThickness];

			shape.style.setProperty("--clip",
				/*`polygon(0 0, 0 100%, 
				  ${borderThickness}px 100%, 
				  ${borderThickness}px ${borderThickness}px, 
				  ${innerB[0]}px ${innerB[1]}px, 
				  ${innerA[0]}px ${innerA[1]}px, 
				  100% 100%, 
				  ${w - cornerWidth}px 0)`);
			  */
				`polygon(0 0, 0 100%, 
          ${borderThickness}px 100%, 
          ${borderThickness}px ${borderThickness}px, 
          ${innerB[0]}px ${innerB[1]}px, 
          100% 100%,
          100% ${h - borderThickness}px, 
          ${w - cornerWidth}px 0)`);

			shape.style.setProperty("--clip-outer", `polygon(0 0, 0 100%, 100% 100%, 100% ${h - borderThickness}px, ${w - cornerWidth}px 0)`);
			shape.style.setProperty("--clip-inner",
				`polygon(${borderThickness}px 100%, ${borderThickness}px ${borderThickness}px, ${innerB[0]}px ${innerB[1]}px, 100% 100%)`);
		}

	}
})();


/*
  gather selector groups and section groups
  pair selectors with their sections
*/
(function () {
	const selectorGroups = document.querySelectorAll("[name='selector-group']");
	const sectionGroups = document.querySelectorAll("[name='section-group']");

	for (const selectorGroup of selectorGroups) {
		const sectionGroupMatch = Array.from(sectionGroups).find((element) => element.getAttribute("data-selector-group") == selectorGroup.getAttribute("data-selector-group"));
		if (sectionGroupMatch) {
			sectionGroupMatch.setAttribute("data-active-section", 1);

			selectorGroup.querySelectorAll("input[name='selector']").forEach((selector) => {
				selector.setAttribute("name", `${selector.getAttribute("name")}-${selectorGroup.getAttribute("data-selector-group")}`);
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