import { equal, deepEqual, notEqual } from "assert";
import fs from "fs";
import { allUsers, createUser, getUser, deleteUser, createRequest, setUser } from "./request";

const payload = fs.readFileSync('../rsa/payload-word');

describe('API on Request', () => {

    it('Return config status', async () => {
        const response = await createRequest(
            'get',
            '/config?query={payload,version}'
        );
        const { data } = JSON.parse(response.data); // response.data <string> { <graphql>.data }
        equal(response.status, 200, `response.status is not 200, is ${response.status}`);
        equal(data.version, "vs-1.0.0");
        deepEqual(data.payload, payload.toString());
        return true;
    });

    it('User all users return Array', async () => {
        const { all_users } = await allUsers();
        equal(Array.isArray(all_users), true);
        return true;
    });

    it('User create / get', async () => {
        const name = "Test create get";
        const email = "test-create-get@test.com";
        const description = "This is a test create get";
        const id: number = await createUser({
            name,
            email,
            description
        });
        notEqual(id, NaN);// id do usuario inserido vem pelo response.data.<data[graphql-data]>.<user_add[graphql-mutation_name]
        const { user } = await getUser(id);
        notEqual(user, null);
        equal(user.id, id);
        equal(user.name, name);
        equal(user.email, email);
        equal(user.description, description);
        return true;
    });

    it('User create / set / get', async () => {
        const name = "Test create set get";
        const newName = "This is my new name";
        const email = "test-create-set-get@test.com";
        const newEmail = "newemail@example.com";
        const description = "This is a test create set get";
        const newDescription = "This is a new description";
        const id: number = await createUser({
            name,
            email,
            description
        });
        notEqual(id, NaN);// id do usuario inserido vem pelo response.data.<data[graphql-data]>.<user_add[graphql-mutation_name]
        await setUser({
            id,
            name: newName,
            email: newEmail,
            description: newDescription
        });
        const { user } = await getUser(id);
        notEqual(user, null);
        equal(user.id, id);
        equal(user.name, newName);
        equal(user.email, newEmail);
        equal(user.description, newDescription);
        return true;
    });

    it('User create / del / get', async () => {
        const name = "Test create del get";
        const email = "test-create-del-get@test.com";
        const description = "This is a test create del get";
        const id: number = await createUser({
            name,
            email,
            description
        });
        notEqual(id, NaN);// id do usuario inserido vem pelo response.data.<data[graphql-data]>.<user_add[graphql-mutation_name]
        await deleteUser(id);
        const { user } = await getUser(id);
        equal(user, null);
        return true;
    });

});

/**
 * // para teste
 * let http = new XMLHttpRequest();
 * const url = 'config?query={payload,version}';
 * let params = 'user=ipsum&pass=binny';
 * http.open('POST', url, true);
 * http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 * http.setRequestHeader("Authorization", "Bearer -----BEGIN CERTIFICATE-----\\n7zQC6JGSrFds+EdwcTHt4DVcEspdvSoiGWYjTeGNIj64OdJeSMZLpWmk5m8ADYQ6hGPEJ\\n-----END CERTIFICATE-----\\n\r\n");
 * http.onreadystatechange = function() {//Call a function when the state changes.
 *   if(http.readyState == 4 && http.status == 200) {
 *      console.log(http.responseText);
 *   }
 * }
 * http.send(params);
 */
