import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerChangedAddressEvent from "../event/customer-changed-address.event";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    let customer = CustomerFactory.create("John");

    
    // disparando o evento de notificacao de criacao
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    var customerCreatedEvent = new CustomerCreatedEvent({ });

    eventDispatcher.notify(customerCreatedEvent);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.createWithAddress("John", address);


    // dispara o evento de alteracao de endereco
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    const customerChangedAddressEvent = new CustomerChangedAddressEvent ({
      id: customer.id,
      name: customer.name,
      endereco: customer.Address
    });

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);
    eventDispatcher.notify(customerChangedAddressEvent);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);
  });
});
