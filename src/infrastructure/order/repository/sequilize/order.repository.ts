import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";

export default class OrderRepository implements RepositoryInterface<Order> {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    /*
    var items: OrderItemModel[] = [];
    for (var i = 0; i < entity.items.length; i++) {
      const orderItemModel = new OrderItemModel();
      orderItemModel.id = entity.items[i].id;
      orderItemModel.product_id = entity.items[i].productId;
      orderItemModel.order_id = entity.id;
      orderItemModel.quantity = entity.items[i].quantity;
      orderItemModel.name = entity.items[i].name;
      orderItemModel.price = entity.items[i].price;

      items.push(orderItemModel);
    }
    */

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        }
      }
    ).then(result => { 
      // console.log("Sucesso update: " + result);
    }).catch(error => {
      console.log("Erro update: " + error);
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id: id }, include: ["items"] });

    var items: OrderItem[] = [];
    for (var i = 0; i < orderModel.items.length; i++) {
      var item = new OrderItem(orderModel.items[i].id, orderModel.items[i].name, orderModel.items[i].price, orderModel.items[i].product_id, orderModel.items[i].quantity);
      items.push(item);
    }

    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    var orderModels: OrderModel[] = await OrderModel.findAll(
      {
        include: [{ model: OrderItemModel }],
      }
    );

    var ordersReturn: Order[] = [];

    for (var i = 0; i < orderModels.length; i++) {
      var items: OrderItemModel[] = orderModels[i].items;
      var orderItem: OrderItem = new OrderItem(items[0].id, items[0].name, items[0].price, items[0].product_id, items[0].quantity);
      
      ordersReturn.push( new Order(orderModels[i].id, orderModels[i].customer_id, [orderItem]) );
    }

    return ordersReturn;
  }
}
