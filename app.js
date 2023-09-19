document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const websiteUrl = document.getElementById('websiteUrl').value;

    // Perform a fetch request to get the HTML content of the provided URL
    fetch(websiteUrl)
        .then(response => response.text())
        .then(html => {
            // Create a virtual DOM element to parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract all image elements from the parsed HTML
            const images = doc.querySelectorAll('img');

            // Perform alt text analysis
            const imageList = document.getElementById('imageAnalyzer');
            imageList.innerHTML = '';

            images.forEach((image, index) => {
                const altText = image.alt;
                const listItem = document.createElement('div');

                if (!altText || altText.trim() === '') {
                    listItem.innerHTML = `<p>Image ${index + 1}: Alt text missing or empty</p>`;
                    listItem.classList.add('missing-alt');
                } else {
                    listItem.innerHTML = `<p>Image ${index + 1}: Alt text - ${altText}</p>`;
                }

                imageList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching and analyzing the website. Please try again.');
        });
});
