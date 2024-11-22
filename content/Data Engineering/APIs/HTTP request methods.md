
> [!info]
> Sometimes referred to as *HTTP verbs*, they indicate the purpose of a request and what is expected if the request is successful. Request methods are classified as: safe, idempotent or cacheable.
> 

##### [`GET`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)
The `GET` method requests a representation of the specified resource. Requests using `GET` should only retrieve data and should not contain a request [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).

##### [`HEAD`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)

The `HEAD` method asks for a response identical to a `GET` request, but without a response body.

##### [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

The `POST` method submits an entity to the specified resource, often causing a change in state or side effects on the server.

##### [`PUT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)

The `PUT` method replaces all current representations of the target resource with the request [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
##### [`DELETE`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)

The `DELETE` method deletes the specified resource.

##### [`CONNECT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT)

The `CONNECT` method establishes a tunnel to the server identified by the target resource.

##### [`OPTIONS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)

The `OPTIONS` method describes the communication options for the target resource.

##### [`TRACE`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE)

The `TRACE` method performs a message loop-back test along the path to the target resource.

##### [`PATCH`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)

The `PATCH` method applies partial modifications to a resource.

[MDN Web Docs]([HTTP request methods - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods))


| Method  | Safe | Idempotent | Cacheable   |
| ------- | ---- | ---------- | ----------- |
| GET     | Yes  | Yes        | Yes         |
| HEAD    | Yes  | Yes        | Yes         |
| OPTIONS | Yes  | Yes        | No          |
| TRACE   | Yes  | Yes        | No          |
| PUT     | No   | Yes        | No          |
| DELETE  | No   | Yes        | No          |
| POST    | No   | No         | Conditional |
| PATCH   | No   | No         | Conditional |
| CONNECT | No   | No         | No          |

### HTTP Method Properties: Safe, Idempotent, and Cacheable

When working with HTTP methods, there are key characteristics that define how a method interacts with resources and how it behaves in various scenarios. These properties are **safe**, **idempotent**, and **cacheable**. Understanding these concepts is important for designing reliable and efficient web APIs.

#### 1. Safe Methods

A **safe** method is one that does not modify the state of the resource it interacts with. In other words, a safe method only retrieves information and does not cause any side effects on the server or resource. Safe methods are read-only operations.

- **Purpose**: To retrieve data without altering it.
- **Examples**: `GET`, `HEAD`, `OPTIONS`, and `TRACE`.
  
#### Key Characteristics of Safe Methods:
- They do not change the resource or server state.
- They are typically used for retrieving information or metadata.
- They are ideal for operations where you only need to read data without affecting the server's data.

##### Example:
- `GET /users`: This method retrieves information about users but does not modify any data on the server.

---

### 2. Idempotent Methods

An **idempotent** method is one that can be called multiple times with the same input and will always produce the same result. In other words, making the same request repeatedly will not change the outcome after the first request. Idempotency ensures that repeated operations do not have unintended side effects.

- **Purpose**: To perform an operation that can be safely repeated without changing the result.
- **Examples**: `GET`, `PUT`, `DELETE`, and `HEAD`.

#### Key Characteristics of Idempotent Methods:
- Repeating the same request multiple times results in the same state of the resource.
- The server's state does not change after the first request, even if the request is repeated.
- Idempotency is important for reliability in APIs, especially for retrying requests.

##### Example:
- `PUT /users/123`: This method updates or creates a user resource with the same data. Repeating the request with the same data will not change the resource further.

---

### 3. Cacheable Methods

A **cacheable** method is one where the response can be stored (cached) and reused for subsequent requests. Caching can help improve performance by reducing the need to make repeated requests to the server for the same resource.

- **Purpose**: To allow responses to be cached and reused.
- **Examples**: `GET` and `HEAD` are often cacheable.
  
#### Key Characteristics of Cacheable Methods:
- Responses can be cached by the client, proxies, or any intermediary server.
- Cacheable methods reduce load on the server by serving repeated requests from the cache.
- Responses from cacheable methods must include cache-control headers to indicate how long and under what conditions the response can be cached.

##### Example:
- `GET /products`: The response for this method can be cached by the browser or proxy, so if the same request is made again, the cached response can be used, avoiding another request to the server.

---

### Summary Table

| Property       | Definition                                                                  | Example Methods       |
|----------------|-----------------------------------------------------------------------------|-----------------------|
| **Safe**       | Methods that do not modify the resource or server state.                    | `GET`, `HEAD`, `OPTIONS`, `TRACE` |
| **Idempotent** | Methods that can be safely repeated without changing the result.            | `GET`, `PUT`, `DELETE`, `HEAD` |
| **Cacheable**  | Methods where the response can be stored and reused for subsequent requests. | `GET`, `HEAD`         |
