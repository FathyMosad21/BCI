function addToInput(letter) {
    document.getElementById("inputField").value += letter;
}

document.addEventListener("DOMContentLoaded", () => {
    window.startHighlighting = function() {
        setTimeout(() => {
            let attempts = 0;
            const maxAttempts = 15;
            const gridItems = document.querySelectorAll(".grid-item");
            const totalRows = 6;
            const totalCols = Math.ceil(gridItems.length / totalRows);

            function getRow(index) {
                return [...gridItems].slice(index * totalCols, (index + 1) * totalCols);
            }

            function getColumn(index) {
                return [...gridItems].filter((_, i) => i % totalCols === index);
            }

            function highlightCycle() {
                if (attempts >= maxAttempts) return;
                attempts++;

                let indexes = [...Array(totalRows + totalCols).keys()];
                indexes.sort(() => Math.random() - 0.5);

                let index = 0;

                function highlightNext() {
                    if (index >= indexes.length) {
                        // Wait 0.75s before starting next cycle
                        if (attempts < maxAttempts) {
                            setTimeout(highlightCycle, 750);
                        }
                        return;
                    }

                    let isRow = indexes[index] < totalRows;
                    let elements = isRow ? getRow(indexes[index]) : getColumn(indexes[index] - totalRows);

                    elements.forEach(el => el.classList.add("highlight"));
                    setTimeout(() => {
                        elements.forEach(el => el.classList.remove("highlight"));
                        index++;
                        highlightNext();
                    }, 100);
                }

                highlightNext();
            }

            highlightCycle();
        }, 2500);
    };
});