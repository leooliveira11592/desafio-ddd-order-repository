import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import EventDispatcher from "../../@shared/event/event-dispatcher";

export default class CustomerFactory {

  public static create(name: string): Customer {
    return new Customer(uuid(), name);
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const customer:Customer = new Customer(uuid(), name);
    customer.changeAddress(address);

    return customer;
  }
}
