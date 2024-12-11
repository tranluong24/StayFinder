import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", {
    name: "Đăng nhập"
  }).click();
  //Kiem tra xem phan Heading co phai la Sign In khong ?
  await expect(page.getByRole("heading",{
    name: "Đăng nhập"
  })).toBeVisible();
  //Chon vao the co thuoc tinh name va dien thong tin dang nhap
  //CSS selector
  await page.locator("[name=email]").fill("hello123@gmail.com");
  await page.locator("[name=password]").fill("123456789");
  //Nhan vao nut Login
  await page.getByRole("button", {
    name: "Login"
  }).click();
  //Kiem tra xem co chu Sign in Thanh cong k ?
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  //Kiem tra xem cac thanh phan co hien thi dung hay k ?
  await expect(page.getByRole("link", {
    name: "Admin"
  })).toBeVisible();

  // await expect(page.getByRole("link", {
  //   name: "My Hotels"
  // })).toBeVisible();

  // await expect(page.getByRole("button", {
  //   name: "Sign Out"
  // })).toBeVisible();

});

test("allow user to register", async( {page} )=>{

  const testEmail = `test_register_${Math.floor(Math.random() * 90000)+10000}@test.com`;

  await page.goto(UI_URL);

  await page.getByRole("link", {
    name: "Sign in"
  }).click();

  await page.getByRole("link", {
    name: "Create an account here"
  }).click();

  await expect(  
    page.getByRole("heading", {
    name: "Create an Account"
  })).toBeVisible();
  

  await page.locator("[name = firstName]").fill("test_firstName");
  await page.locator("[name = lastName]").fill("test_lastName");
  await page.locator("[name = email]").fill(testEmail);
  await page.locator("[name = password]").fill("test_password");
  await page.locator("[name = confirmPassword]").fill("test_password");

  await page.getByRole("button", {
    name: "Create Account"
  }).click();

    //Kiem tra xem co chu registerThanh cong k ?
    await expect(page.getByText("Registration Success!")).toBeVisible();
    //Kiem tra xem cac thanh phan co hien thi dung hay k ?
    await expect(page.getByRole("link", {
      name: "My Bookings"
    })).toBeVisible();
  
    await expect(page.getByRole("link", {
      name: "My Hotels"
    })).toBeVisible();
  
    await expect(page.getByRole("button", {
      name: "Sign Out"
    })).toBeVisible();
})