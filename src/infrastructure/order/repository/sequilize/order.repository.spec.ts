import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    var customerRepository = new CustomerRepository();
    var customer = new Customer("123", "Customer 1");
    var address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    var productRepository = new ProductRepository();
    var product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    var orderItem = new OrderItem(
      "123",
      product.name,
      product.price,
      product.id,
      2
    );

    var order = new Order("123", customer.id, [orderItem]);

    var orderRepository = new OrderRepository();
    await orderRepository.create(order);

    var orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    var items: OrderItemModel[] = orderModel.items;
    var orderItemRecuperado = new OrderItem(items[0].id, items[0].name, items[0].price, items[0].product_id, items[0].quantity);

    var novaQuantidade: number = 5;
    orderItem.changeQuantity(novaQuantidade);
    var orderItem2 = new OrderItem(
      "123",
      product.name,
      product.price,
      product.id,
      novaQuantidade
    );

    var order2 = new Order("123", customer.id, [orderItem2]);
    await orderRepository.update(order2);

    var orderModel2: Order = await orderRepository.find("123");

    // console.log("order2: " + JSON.stringify(order2) );
    // console.log("orderModel2: " + JSON.stringify(orderModel2) );

    expect(order2.items[0].quantity).toEqual(novaQuantidade);
  });

  it("should find a order", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: "123" },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find all orders", async () => {
    
    // criando o pedido 1
    const customerRepository = new CustomerRepository();
    const customer = new Customer("789", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("789", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "789",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("789", "789", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // criando o pedido 2
    const customerRepository2 = new CustomerRepository();
    const customer2 = new Customer("101112", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository2.create(customer2);

    const productRepository2 = new ProductRepository();
    const product2 = new Product("101112", "Product 2", 20);
    await productRepository2.create(product2);

    const orderItem2 = new OrderItem(
      "101112",
      product.name,
      product.price,
      product.id,
      4
    );

    const order2 = new Order("101112", "101112", [orderItem2]);

    const orderRepository2 = new OrderRepository();
    await orderRepository2.create(order2);

    // verificando
    const foundOrders = await orderRepository.findAll();
    const orders = [order, order2];

    // console.log("foundOrders: " + JSON.stringify(foundOrders) );
    // console.log("orders: " + JSON.stringify(orders) );

    expect(orders).toEqual(foundOrders);    
  });
});
