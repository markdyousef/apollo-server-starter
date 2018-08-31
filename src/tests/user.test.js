import * as userApi from "./api";

describe("users E2E", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async done => {
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "markdyousef",
            email: "markdyousef@gmail.com",
            role: "ADMIN"
          }
        }
      };

      const result = await userApi.user({ id: "1" });
      expect(result.data).toEqual(expectedResult);
      done();
    });
    it("returns null when user cannot be found", async done => {
      const expectedResult = {
        data: {
          user: null
        }
      };

      const result = await userApi.user({ id: "50" });

      expect(result.data).toEqual(expectedResult);
      done();
    });
  });
  describe("deleteUser(id: String!):Boolean!", () => {
    it("returns an error because only admins can delete a user", async done => {
      const {
        data: {
          data: {
            signIn: { token }
          }
        }
      } = await userApi.signIn({ login: "andrewyousef", password: "12345678" });

      const {
        data: { errors }
      } = await userApi.deleteUser({ id: "1" }, token);

      expect(errors[0].message).toEqual("Not authorized as admin");
      done();
    });
  });
});
