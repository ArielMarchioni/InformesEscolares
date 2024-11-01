
async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Recoger los datos del formulario
    const nombreJardin = document.getElementById('nombreJardin').value;
    const direccionJardin = document.getElementById('direccionJardin').value;
    const sala = document.getElementById('sala').value;
    const turno = document.getElementById('turno').value;
    const seccion = document.getElementById('seccion').value;
    const docente = document.getElementById('docente').value;
    const nombreAlumno = document.getElementById('nombreAlumno').value;
    const edad = document.getElementById('edad').value;
    const juego = document.getElementById('juego').value;
    const companerismo = document.getElementById('companerismo').value;
    const matematicas = document.getElementById('matematicas').value;
    const otros = document.getElementById('otros').value;

    // Validación simple
    if (!nombreAlumno || !nombreJardin || !direccionJardin) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Función para agregar la imagen
    const addImageToPDF = (pdf) => {
        const imgInput = document.getElementById("imagen");
        if (imgInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    const maxWidth = 120; // Ajustar el ancho máximo de la imagen
                    const scale = maxWidth / img.width;
                    const imgHeight = img.height * scale;

                    pdf.addImage(event.target.result, 'PNG', 10, 10, maxWidth, imgHeight);
                    agregarTexto(pdf); // Asegúrate de que esto se llame aquí
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imgInput.files[0]);
        } else {
            agregarTexto(pdf); // Si no hay imagen, llamar a la función de texto directamente
        }
    };

    function agregarTexto(pdf) {
        pdf.setFontSize(12);
        pdf.text(nombreJardin, 190, 15, { align: 'right' });
        pdf.text(direccionJardin, 190, 25, { align: 'right' });

        // Información general
        let informe = `Sala: ${sala}    Turno: ${turno}    Sección: ${seccion}\n`;
        informe += `Docente: ${docente}\nNombre y Apellido: ${nombreAlumno}    Edad: ${edad} años\n\n`;

        // Evaluación en juego
        informe += juego === 'bien'
            ? `En juego, ${nombreAlumno} muestra un excelente desempeño en actividades lúdicas.\n`
            : `En juego, ${nombreAlumno} necesita mejorar su participación en actividades lúdicas.\n`;

        // Evaluación en compañerismo
        informe += companerismo === 'bien'
            ? `En compañerismo, ${nombreAlumno} es un excelente compañero/a y ayuda a sus pares.\n`
            : `En compañerismo, ${nombreAlumno} debe trabajar en su interacción con los demás.\n`;

        // Evaluación en matemáticas
        informe += matematicas === 'bien'
            ? `En matemáticas, ${nombreAlumno} está muy bien, sabe contar y sumar correctamente.\n`
            : `En matemáticas, ${nombreAlumno} necesita mejorar su comprensión en los conceptos básicos.\n`;

        // Añadir el informe y manejar múltiples páginas
        const textoInforme = pdf.splitTextToSize(informe, 180);
        let y = 50; // posición inicial en y
        const lineHeight = 10; // altura de cada línea
        const pageHeight = 290; // altura de la página

        textoInforme.forEach(line => {
            if (y + lineHeight > pageHeight) {
                pdf.addPage(); // agrega nueva página
                y = 10; // reinicia la posición y
            }
            pdf.text(line, 10, y);
            y += lineHeight; // incrementa la posición y
        });

        // Agregar observaciones adicionales
        if (otros) {
            const observaciones = pdf.splitTextToSize(`Observaciones adicionales: ${otros}`, 180);
            observaciones.forEach(line => {
                if (y + lineHeight > pageHeight) {
                    pdf.addPage(); // agrega nueva página
                    y = 10; // reinicia la posición y
                }
                pdf.text(line, 10, y);
                y += lineHeight; // incrementa la posición y
            });
        }

        // Agregar espacio para las firmas en la misma línea
        if (y + 30 > pageHeight) {
            pdf.addPage(); // agrega nueva página si es necesario
            y = 10; // reinicia la posición y
        }
        y += 30;
        pdf.text("Firma de Madre/Padre/Tutor", 10, y);
        pdf.text("Firma del Docente", 80, y);
        pdf.text("Firma del Directivo", 150, y);

        pdf.save(`${nombreAlumno}_evaluación.pdf`);
    }

    // Llamar a la función para agregar la imagen y texto
    addImageToPDF(pdf);
}
