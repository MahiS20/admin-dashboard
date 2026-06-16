import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.anonymoose.co/graphql";
const API_KEY = "c0b036dd131d48beada4a4e221054016";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin_session");

  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = `
    query {
      getOrganisations(filters: {}) {
        organisations {
          organisationId
          name
          identifier
          createdAt
          license {
            status
            startDate
            expiryDate
          }
          verification {
            sms
            email
          }
        }
        metaData {
          totalDataCount
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("admin_session");

  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const mutation = `
    mutation CreateOrganisation($data: CreateOrganisationInput!) {
      createOrganisation(data: $data) {
        organisation {
          organisationId
          name
          identifier
          createdAt
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { data: body },
    }),
  });

  const text = await res.text();
  console.log("CREATE RESPONSE:", text);

  if (!text) {
    return NextResponse.json({ error: "Empty response" }, { status: 500 });
  }

  const data = JSON.parse(text);
  return NextResponse.json(data);
}