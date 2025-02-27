const projectDocID = "1QdR-rhAUXKioBX6O_77ADhYKNA6EaSEQB0xiHqOHGf4";
const blogDocID = "1AqB-qUFwaGI5-mfEfUVkTaEIPRo5DlVwvnI2wsWmRDI";
const link = `https://docs.google.com/document/d/${projectDocID}/edit?usp=sharing`;
const apiKey = "AIzaSyBHhqGZRJIo90yIk1K-J86C9PU3whMe8CA";


async function ParseDoc(docID, textParser, errorCall) {
    await fetch(`https://www.googleapis.com/drive/v3/files/${docID}/export?mimeType=text/plain&key=${apiKey}`)
        .then(function (res) {
            return res.text();
        }).then(textParser
        ).catch(errorCall);
}
ParseDoc(projectDocID,
    function (text) {
        text = text.substring(text.indexOf("<projects>"), text.length);
        const dataObj = ParseDocProjects(text.toString());

        const gameList =  document.querySelector(".project-list[data-project-list-type='games']");
        const toolList =  document.querySelector(".project-list[data-project-list-type='tools']");
        const otherList = document.querySelector(".project-list[data-project-list-type='other']");

        dataObj.projectDataArray.forEach(object => {
            const project = CreateProjectElement(object.title, object.shortDesc, object.longDesc, object.img);
            if(object.category === "Games"){
                gameList.appendChild(project);
            }else if(object.category === "Tools"){
                toolList.appendChild(project);
            }else{
                otherList.appendChild(project);
            }
        });

        InitToggleIcon();

        gameList.removeChild(gameList.querySelector(".lds-ring"));
        toolList.removeChild(toolList.querySelector(".lds-ring"));
        otherList.removeChild(otherList.querySelector(".lds-ring"));
    },
    function (e) {
        console.log(e.toString());
    });

/*    
ParseDoc(blogDocID,
    function (text) {
        text = text.substring(text.indexOf("<blogs>"), text.length);
        console.log(ParseDocBlogs(text));
    },
    function (e) {
        console.log(e.toString());
    });*/

function ParseDocProjects(text) {
    let result = {
        "categoryArray": [],
        "projectDataArray": []
    };
    let textArray = text.split("\r\n");
    let index = 1;

    while (index < textArray.length) {
        if (textArray[index] === "" || textArray[index] === "</>") {
            index++;
            continue;
        }

        let projectObj = {
            "title": CustomTagReplacer(textArray[index++]),
            "category": "",
            "img": "",
            "shortDesc": "",
            "longDesc": ""
        };

        if (textArray[index].indexOf('<') == 0 && textArray[index].indexOf('>') > -1) {
            projectObj.category = textArray[index].substring(1, textArray[index].length - 1);
            if (projectObj.category !== "none" && projectObj.category !== "" && !result.categoryArray.includes(projectObj.category)) {
                result.categoryArray.push(projectObj.category);
            }
            index++;
        }
        projectObj.img = textArray[index++];

        let projectText = "";
        for (; index < textArray.length; index++) {
            if (textArray[index] === "</>") { //end of project
                index++;
                if (projectObj.shortDesc === "") {
                    projectObj.shortDesc = CustomTagReplacer(projectText);
                }
                else {
                    projectObj.longDesc = CustomTagReplacer(projectText);
                }
                break;
            }
            else if (textArray[index] === "<//>") { //end of short desc
                projectObj.shortDesc = CustomTagReplacer(projectText);
                projectText = "";
                continue;
            }
            projectText += textArray[index] + "\r\n";
            if (textArray[index] === "" && textArray[index + 1] === "") {
                index++;
            }
        }
        result.projectDataArray.push(projectObj);
    }
    return result;
};

function ParseDocBlogs(text) {
    const blogDataArray = [];
    let textArray = text.split("\r\n");
    let index = 1; //skip <blogs> tag

    while (index < textArray.length) {
        if (textArray[index] === "") {
            index++;
            continue;
        }

        let blog = {
            "title": CustomTagReplacer(textArray[index++]),
            "desc": "",
            "body": "",
            "data": ""
        };

        let blogText = "";
        for (; index < textArray.length; index++) {
            if (textArray[index] === "</>") {
                index++;
                blog.body = CustomTagReplacer(blogText);
                blog.body = BlogSubheadingFormatter(blog.body);
                break;
            }
            else if (textArray[index] === "<//>") {
                blog.desc = CustomTagReplacer(blogText);
                blogText = "";
                continue;
            }

            blogText += textArray[index] + "\r\n";
            if (textArray[index] === "" && textArray[index + 1] === "") {
                index++;
            }
        }

        if (index < textArray.length && textArray[index].includes("{")) {
            if (textArray[index].includes("}")) {
                blog.data = textArray[index].substring(textArray[index].indexOf("{") + 1, textArray[index].indexOf("}"));
                index++;
            }
            else {
                for (; index < textArray.length; index++) {
                    if (textArray[index].includes("{")) {
                        blog.data = textArray[index].substring(textArray[index].indexOf("{") + 1, textArray[index].length) + " ";
                    }
                    else if (textArray[index].includes("}")) {
                        blog.data += textArray[index].substring(0, textArray[index].indexOf("}"));
                        index++;
                        break;
                    }
                    else {
                        blog.data += textArray[index].substring(0, textArray[index].length) + " ";
                    }
                }
            }
        }
        if (!blog.data.includes("DNR")) { blogDataArray.push(blog); }
    }
    return blogDataArray.reverse();
};

function BlogSubheadingFormatter(blogText) {
    let result = blogText;
    const headerColors = ["rgb(201, 237, 222)", "rgb(201, 226, 237)", "rgb(201, 201, 237)", "rgb(237, 201, 192)"];
    let hColorIndex = 0;
    if (result.charAt(0) === "-") {
        let end = result.indexOf("<br>");
        let sub = result.substring(0, end);
        let num = sub.search(/[^-]/);
        result = result.replace(sub, `<h${3 + num} style='color:${headerColors[hColorIndex++]}'>${sub.substring(num)}</h${3 + num}>`);
    }
    while (result.includes("<br>-")) {
        let start = result.indexOf("<br>-");
        let end = result.indexOf("<br>", start + 5);
        let sub = result.substring(start + 4, end);
        let num = sub.search(/[^-]/);

        result = result.replace(sub, `<h${3 + num} style='color:${headerColors[hColorIndex++]}'>${sub.substring(num)}</h${3 + num}>`);
        if (hColorIndex >= headerColors.length) { hColorIndex = 0; }
    }
    return result;
}

function ParseBlogTags(text) {
    const dataObj = {};
    if (!text) { return dataObj; }
    text.replaceAll(/[{}\n]|\r\n/g, "").split(";").forEach(element => {
        let tag = element.substring(0, element.indexOf(":")).trim();
        dataObj[tag] = element.substring(element.indexOf(":") + 1).trim();
    });
    return dataObj;
}

function CustomTagReplacer(text) {
    const tagObj = {//tags of type "closed" are passed the full tag <tag>...</tag> into value func/ type of single replaces <tag>
        unity: function (text) { return '<span class="icon unity"></span>' },
        github: function (text) { return '<span class="icon github"></span>' },
        "itch-io": function (text) { return '<span class="icon itch-io"></span>' },
        codepen: function (text) { return '<span class="icon codepen"></span>' },
        $: function (text) {
            return text.replace(/^<\$>(.*)<\/\$>$/g, "$1").replace(/<|>/g,
                function (matched) {
                    if (matched === "<") { return "&lt;"; }
                    else if (matched === ">") { return "&gt;"; }
                });
        },
        link: function (text) {
            let inner = text.match(/^<link (\S+?)>(.*?)<\/link>$/);
            if (inner && inner[1]) {
                if (inner[2]) { return `<a href="${inner[1]}">${inner[2]}</a>`; }
                else { return `<a href="${inner[1]}">${inner[1]}</a>`; }
            }
            return text;
        }
    };

    let result = recurs(text);
    result = result.replaceAll(/\r\n|\n/g, "<br>").replaceAll("<codeblock><br>", "<codeblock>");//clean up
    return result;

    //turn <tag> or <tag data=things> to tag
    function getRawTag(tag) {
        let raw = tag.replace(/^<\/?(.*?)>$/, '$1');
        if (raw.includes(" ")) { raw = raw.split(" ")[0]; }
        if (raw && raw !== " ") { return raw; }
        else return undefined;
    }
    function getLeadTagIndex(tagArray, startIndex) {//start index is the index of the tag to find pair for
        if (startIndex < 0 || startIndex >= tagArray.length) { return -1; }
        if (tagArray.length === 1) { return -1; }
        else if (tagArray[startIndex][0].charAt(1) !== "/") { return -1; }//is not an end tag and therfore has no lead tag or is the lead tag
        else {
            const rawTag = getRawTag(tagArray[startIndex][0]);
            let nestedCount = 0;
            for (let i = startIndex - 1; i >= 0; i--) {
                if (getRawTag(tagArray[i][0]) === rawTag) {//match
                    if (tagArray[i][0] === `</${rawTag}>`) {//found nested
                        nestedCount++;
                    } else {
                        if (nestedCount > 0) {//exit nest
                            nestedCount--;
                        } else {//true match found
                            return i;
                        }
                    }
                }
            }
            return -1;//no match found
        }
    }
    function tagToHTMLString(tag, fullTag) {//tag = <tag>/ fulltag = <tag>text</tag> or just <tag>
        let rawTag = getRawTag(tag);
        if (tagObj.hasOwnProperty(rawTag)) { return tagObj[rawTag](fullTag); }
        else { return fullTag; }
    }
    function recurs(htmlString) {
        let result = htmlString;
        const tagsInString = Array.from(htmlString.matchAll(/<.*?>|\&\lt\;.*?\&\gt\;/g));

        if (!tagsInString) { return htmlString; }

        for (let i = tagsInString.length - 1; i >= 0;) {
            if (tagsInString[i] === "") { continue; }

            let tagsReplaced = 0;
            const leadTagIndex = tagsInString.length > 1 ? getLeadTagIndex(tagsInString, i) : -1;
            const fullTag = leadTagIndex === -1 ? tagsInString[i][0] : result.substring(tagsInString[leadTagIndex].index, tagsInString[i].index + tagsInString[i][0].length);
            let spliceHeadEnd = leadTagIndex;
            let spliceContnent = "";//the content to replace fulltag in main string

            if (leadTagIndex !== -1 && i - leadTagIndex > 1) {//contains other tags
                let recursionResult = recurs(fullTag.substring(tagsInString[leadTagIndex][0].length, fullTag.length - tagsInString[i][0].length));//call recursion on string in tag
                spliceContnent = tagToHTMLString(tagsInString[i][0], tagsInString[leadTagIndex][0] + recursionResult + tagsInString[i][0]);
                tagsReplaced = i - leadTagIndex + 1;
            } else {//single tag or has no tags within
                spliceHeadEnd = leadTagIndex !== -1 ? leadTagIndex : i;
                spliceContnent = tagToHTMLString(tagsInString[i][0], fullTag);
                tagsReplaced = leadTagIndex !== -1 ? 2 : 1;
            }

            result = result.slice(0, tagsInString[spliceHeadEnd].index) + spliceContnent + result.slice(tagsInString[i].index + tagsInString[i][0].length);
            i -= tagsReplaced;
        }
        return result;
    }
}


function CreateProjectElement(title, shortDesc, longDesc, img) {
    const template = document.getElementById("project-element-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector("h4").insertAdjacentHTML("beforeend", title);

    const shortText = document.createElement("p");
    shortText.style.marginBottom = "0";
    shortText.insertAdjacentHTML("beforeend", shortDesc);
    clone.querySelector(".project-container").appendChild(shortText);

    if (!longDesc) {
        clone.firstChild.removeChild(clone.querySelector(".project-details"));
    } else {
        const longText = document.createElement("p");
        longText.style.marginBottom = "0";
        longText.insertAdjacentHTML("beforeend", longDesc);
        clone.querySelector(".project-details").appendChild(longText);
    }

    if (!img || img.toLowerCase() === "none") {
        clone.querySelector(".project-container").removeChild(clone.querySelector(".project-img"));
    } else {
        clone.querySelector("img").src = img;
    }

    return clone;
}


/*
  set up icon toggle
*/
function InitToggleIcon() {
    const toggles = document.querySelectorAll(".toggle-icon");
    for (const iconToggle of toggles) {
        const iconElement = iconToggle.classList.contains("icon") ? iconToggle : iconToggle.querySelector(".icon");
        const activeIcon = iconToggle.getAttribute("data-active-icon");
        const neutralIcon = iconToggle.getAttribute("data-neutral-icon");

        if (!iconElement.classList.contains(neutralIcon)) {
            iconElement.classList.add(neutralIcon);
        }

        // toggle fires when element with toggle-icon class is clicked, not necessarily the icon element
        iconToggle.addEventListener("click", () => {
            if (iconElement.classList.contains(neutralIcon)) {
                iconElement.classList.remove(neutralIcon);
                iconElement.classList.add(activeIcon);
            } else {
                iconElement.classList.remove(activeIcon);
                iconElement.classList.add(neutralIcon);
            }
        });
    }
}