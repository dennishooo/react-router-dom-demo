import { useEffect, useState } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  console.log("location: ", navigation.location);
  console.log("location.search: ", navigation.location?.search);
  console.log(
    "URLSearchParams: ",
    new URLSearchParams(navigation.location?.search)
  );
  console.log(
    "URLSearchParams has q: ",
    new URLSearchParams(navigation.location?.search).has("q")
  );
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.querySelector("#q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              className={searching ? "loading" : ""}
              name="q"
              defaultValue={q}
              onChange={(e) => {
                const isFirstSearch = q == null;
                submit(e.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: any) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}{" "}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

export async function action() {
  const contact = await createContact();
  return { contact };
}

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts: any = await getContacts(q);
  return { contacts, q };
}
