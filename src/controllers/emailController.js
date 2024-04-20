import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';


export class EmailController {

    static async sendMail(req, res) {
        try {

            // Obtener la ruta del archivo actual
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const {html, to, subject} = req.body;


            // Verificar si los campos son enviados
            if (!html || !to || !subject) {
                return res.status(400).json({ error: 'Los campos html, to y subject son requeridos.' });
            }
            // Verificar si los campos requeridos tienen valores no vacíos
            if (html.trim() === '' || to.trim() === '' || subject.trim() === '') {
                return res.status(400).json({ error: 'Los campos html, to y subject no pueden estar vacíos.' });
            }
            // Verificar si el campo 'to' es un correo electrónico válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(to)) {
                return res.status(400).json({ error: 'El campo "to" debe ser una dirección de correo electrónico válida.' });
            }


            // Configurar el transporte del correo electrónico
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                }
            });

            /// Leer el contenido del archivo HTML
            const htmlFilePath = path.join(__dirname, '../public/index.html');
            // const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
            const htmlContent = html;

            // Configurar el correo electrónico
            const mailOptions = {
                from: process.env.MAIL_FROM,
                to: to,
                subject: subject,
                html: htmlContent
            };

            // Enviar el correo electrónico
            await transporter.sendMail(mailOptions);

            
            res.status(201).json({ message: 'Correo electrónico enviado correctamente'});
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        }
    }

}