export function loadTechnologies(htmlDiv, url) {
    fetch(url)
        .then(response => response.json())
        .then(technos => technos.map(t => `<div class="spacer"><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`).join(''))
        .then( mapping => htmlDiv.innerHTML = mapping )
        .catch(console.error);
}

