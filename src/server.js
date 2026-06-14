import express from 'express';
import bodyParser from 'body-parser';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use('/api/invoices', invoiceRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Invoice API service running on http://localhost:${port}`);
});
