import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Customer from "../../entity/customer";
import CustomerFactory from "../../factory/customer.factory";
import CustomerCreatedEvent from "../customer-created.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerCreatedEvent>
{

  handle(event: CustomerCreatedEvent): void {
    console.log("Endereço do cliente: " + event.eventData.id + ", " + event.eventData.name + " alterado para: " +  event.eventData.endereco); 
  }
}
