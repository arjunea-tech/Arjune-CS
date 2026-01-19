import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const HTML_STYLE = `
<style>
  body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20px; color: #333; }
  .header { text-align: center; border-bottom: 2px solid #FF6B00; padding-bottom: 10px; margin-bottom: 20px; }
  .header h1 { color: #FF6B00; margin: 0; }
  .header p { color: #666; margin: 5px 0 0; }
  .report-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #888; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background-color: #f8f9fa; color: #FF6B00; text-align: left; padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
  td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
  .status { font-weight: bold; border-radius: 4px; padding: 2px 6px; font-size: 10px; text-transform: uppercase; }
  .status-paid { background-color: #d4edda; color: #155724; }
  .status-pending { background-color: #fff3cd; color: #856404; }
  .status-requested { background-color: #f8d7da; color: #721c24; }
  .total-row { font-weight: bold; background-color: #fff8f4; }
  .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 10px; }
  @media print {
    .no-print { display: none; }
  }
</style>
`;

export const generateReport = async (title, contentHTML) => {
    const dateStr = new Date().toLocaleString();
    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        ${HTML_STYLE}
      </head>
      <body>
        <div class="header">
          <h1>3BEE CRACKERS</h1>
          <p>${title}</p>
        </div>
        <div class="report-info">
          <span>Report Generated: ${dateStr}</span>
          <span>Admin Panel Report</span>
        </div>
        ${contentHTML}
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} 3BEE CrackerShop Admin System. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

    try {
        const { uri } = await Print.printToFileAsync({ html });
        if (Platform.OS === 'ios') {
            await Sharing.shareAsync(uri);
        } else {
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        }
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};

/**
 * Orders Report
 */
export const printOrdersReport = async (orders, periodLabel = 'All Time') => {
    let tableRows = '';
    let totalAmount = 0;

    orders.forEach(order => {
        const price = parseFloat(order.amount?.replace(/[^0-9.]/g, '') || 0);
        totalAmount += price;

        tableRows += `
      <tr>
        <td>#${order.id?.substring(order.id.length - 6).toUpperCase()}</td>
        <td>${order.customer}</td>
        <td>${order.date}</td>
        <td><span class="status">${order.status}</span></td>
        <td style="text-align: right;">${order.amount}</td>
      </tr>
    `;
    });

    const content = `
    <h3>Order Report - ${periodLabel}</h3>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
        <tr class="total-row">
          <td colspan="4" style="text-align: right;">Total Sales:</td>
          <td style="text-align: right;">₹${totalAmount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  `;

    await generateReport(`Orders Report (${periodLabel})`, content);
};

/**
 * Inventory Report
 */
export const printInventoryReport = async (productsByCat) => {
    let sections = '';

    Object.keys(productsByCat).forEach(cat => {
        let rows = '';
        productsByCat[cat].forEach(p => {
            rows += `
        <tr>
          <td>${p.name}</td>
          <td>${p.stock || 'N/A'}</td>
          <td style="text-align: right;">₹${p.price}</td>
          <td style="text-align: right;">₹${p.discountPrice || '-'}</td>
        </tr>
      `;
        });

        sections += `
      <h3>Category: ${cat}</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Stock</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Discount</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
    });

    await generateReport('Inventory Report (Category Wise)', sections);
};

/**
 * Chit Schemes Report
 */
export const printChitSchemesReport = async (chits) => {
    let rows = '';
    chits.forEach(chit => {
        rows += `
      <tr>
        <td>${chit.name}</td>
        <td>₹${chit.totalAmount}</td>
        <td>₹${chit.installmentAmount}</td>
        <td>${chit.durationMonths} Months</td>
        <td>Active</td>
      </tr>
    `;
    });

    const content = `
    <h3>Chit Fund Schemes Overview</h3>
    <table>
      <thead>
        <tr>
          <th>Scheme Name</th>
          <th>Total Value</th>
          <th>Installment</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

    await generateReport('Chit Fund Schemes Summary', content);
};

/**
 * Specific Chit Detail Report
 */
export const printChitDetailReport = async (schemeName, participants) => {
    let rows = '';
    participants.forEach(p => {
        rows += `
      <tr>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.paidMonths}</td>
        <td>${p.pending}</td>
        <td><span class="status status-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
      </tr>
    `;
    });

    const content = `
    <h3>Scheme: ${schemeName}</h3>
    <h4>Participant List & Progress</h4>
    <table>
      <thead>
        <tr>
          <th>Participant</th>
          <th>Email</th>
          <th>Paid Months</th>
          <th>Pending Months</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

    await generateReport(`Chit Detail Report: ${schemeName}`, content);
};
