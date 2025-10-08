
# ShedLoad Overseas API Documentation

This document provides details on the custom API endpoints available for integration with external applications, such as a desktop client.

---

## 1. Destination Suggestion API

This endpoint performs a "reverse lookup" to suggest a potential shipping destination and package weight based on a given monetary amount. It's useful for providing shipping ideas based on a budget.

- **Endpoint:** `/api/destination-suggestion`
- **Method:** `POST`
- **Authentication:** None required. This is a public endpoint.

### Request Body

The request body must be a JSON object containing the target amount.

```json
{
  "amount": 3500.0
}
```

- `amount` (float, required): The target monetary value (including 18% tax) to find a destination for.

### Logic

- If the `amount` is less than 5000, the API searches the domestic pricing data.
- If the `amount` is 5000 or greater, the API searches the international pricing data.

The API calculates the base price by removing an 18% tax and then finds the closest match in the relevant pricing tables.

### Success Response (200 OK)

The API will return a JSON object with the best-matched destination and estimated weight.

**Example (Domestic):**

For an amount of `3500`, a possible domestic suggestion might be:

```json
{
  "destination": "Rajasthan",
  "weight": 2.5
}
```

**Example (International):**

For an amount of `7000`, a possible international suggestion might be:

```json
{
  "destination": "Canada",
  "weight": 4
}
```

### Error Response (4xx/5xx)

If no suitable match is found or the input is invalid, an error will be returned.

**Example (Not Found):**
```json
{
  "error": "No suitable domestic destination found for this amount."
}
```

**Example (Invalid Input):**
```json
{
  "error": "Amount is required"
}
```

---

## 2. Create Invoice From Payment API

This endpoint is designed for an external application (like a desktop app) to create a fully paid and booked shipment directly in the system. It bypasses the standard multi-step booking and payment flow.

- **Endpoint:** `/api/create-invoice-from-payment`
- **Method:** `POST`
- **Authentication:** None required. This is a public endpoint designed for trusted clients.

### Request Body

The endpoint requires a specific JSON structure containing transaction, sender, and receiver details.

```json
{
  "transaction": {
    "date": "YYYY-MM-DD",
    "utr": "string (12 digits)",
    "amount": float,
    "weight": float
  },
  "sender": {
    "name": "string",
    "address_line1": "string",
    "address_line2": "string (optional)",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string",
    "phone": "string"
  },
  "receiver": {
    "name": "string",
    "address_line1": "string",
    "address_line2": "string (optional)",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string",
    "phone": "string"
  }
}
```

#### Field Descriptions:

- **transaction**:
  - `date` (string): The date of the transaction in `YYYY-MM-DD` format.
  - `utr` (string): The Unique Transaction Reference number.
  - `amount` (float): The total transaction amount (inclusive of tax).
  - `weight` (float): The weight of the package in kilograms.
- **sender**: Contains full address and contact details for the sender.
- **receiver**: Contains full address and contact details for the recipient.

### Logic

1.  **User Association:** The system attempts to find or create a "dummy" user based on the sender's name and a generated local email (e.g., `sanjivkumar@desktop-app-user.local`). This is necessary as all shipments must be associated with a user account.
2.  **Shipment Creation:** A new `Shipment` record is created in the database.
    - Its status is immediately set to `"Booked"`.
    - A tracking history entry is created noting that the shipment was booked via the desktop app.
3.  **Payment Record Creation:** A corresponding `PaymentRequest` record is created.
    - Its status is immediately set to `"Approved"`.
4.  **Admin Panel Visibility:** The newly created shipment and its "Approved" payment status will be visible in the admin dashboard just like any other shipment.

### Success Response (201 Created)

Upon successful creation, the API returns a confirmation with the new shipment and payment IDs.

```json
{
  "message": "Invoice and shipment created successfully from payment.",
  "shipment_id_str": "RSXXXXXX",
  "payment_id": 123,
  "shipment_status": "Booked",
  "payment_status": "Approved"
}
```

### Error Response (4xx/5xx)

If the request body is malformed or an issue occurs, an error is returned.

**Example (Invalid Input):**
```json
{
  "error": "Invalid request body. Missing transaction, sender, or receiver."
}
```

**Example (Processing Error):**
```json
{
  "error": "Transaction amount must be positive."
}
```
