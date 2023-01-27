import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, ContactType, updateContact } from "../contacts";

export default function Contact() {
  const contact: any = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || ""} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: any) {
  // yes, this is a `let` for later
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  if (fetcher.formData) favorite = fetcher.formData.get("favorite") === "true";

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

type LoaderProps = {
  params: ContactType;
};

export async function loader({ params }: LoaderProps) {
  const contact = await getContact(params.contactId);
  console.log("wtfff?", contact);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "No contact found!",
    });
  }
  return contact;
}

export async function action({ request, params }: any) {
  let formData = await request.formData();
  console.log("favorite: ", formData.get("favorite"));

  return updateContact(params.contactId, {
    favourite: formData.get("favorite") === "true",
  });
}
