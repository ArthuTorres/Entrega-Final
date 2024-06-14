import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { ProfileService } from '../../_shared/services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact, Message } from '../../_shared/models/message.models';
import { MessageService } from '../../_shared/services/message.service';
import { AuthService } from '../../_shared/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../_shared/services/user.service';
import { User } from '../../_shared/models/auth.models';
import { FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrl: './messages-page.component.scss'
})
export class MessagesPageComponent implements OnInit {
  @ViewChild("messageList") messageList?: ElementRef

  private contactId?: number;

  myId: number = -1;
  contacts: Contact[] = []
  contactUser?: User;
  currentChat: Message[] = []

  sendMessageForm = this.formBuilder.group({
    "from_id": this.formBuilder.control(-1, [Validators.required]),
    "to_id": this.formBuilder.control(-1, [Validators.required]),
    "message": this.formBuilder.control("", [Validators.required]),
  })

  loadContactsTimeout?: any;
  loadChatTimeout?: any;

  private readonly refreshRate = 15000;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _location: Location
  ) { }

  async ngOnInit() {
    if (this.authService.userData)
      this.myId = this.authService.userData.id

    await this.loadData();

    const contactId = this.activatedRoute.snapshot.params["userId"];
    if (contactId) {
      await this.selectContact(parseInt(atob(contactId)))
    }
  }

  async selectContact(contactId: number) {
    this.contactId = contactId
    await this.loadChat()
    this.resetSendMessageForm()
  }

  private async loadData() {
    await this.loadContacts();
    if (this.contactId)
      await this.loadChat();
  }

  async loadContacts() {
    clearTimeout(this.loadContactsTimeout)

    this.contacts = await firstValueFrom(this.messageService.getChats())

    this.loadContactsTimeout = setTimeout(() => {
      this.loadContacts()
    }, this.refreshRate);
  }

  async loadChat() {
    if (!this.contactId)
      return

    clearTimeout(this.loadChatTimeout)

    if (this.contactUser?.id != this.contactId)
      this.contactUser = await firstValueFrom(this.userService.getById(this.contactId))
    this.currentChat = await firstValueFrom(this.messageService.getMessagesWith(this.contactId))

    requestAnimationFrame(() => {
      const messageListElement = this.messageList?.nativeElement as HTMLUListElement
      const scrollPosition = messageListElement.scrollHeight - messageListElement.clientHeight;
      messageListElement.scrollTop = scrollPosition;
    })

    this.loadChatTimeout = setTimeout(() => {
      this.loadChat()
    }, this.refreshRate);
  }

  async sendMessage() {
    const payload = this.sendMessageForm.value
    await firstValueFrom(this.messageService.insert(payload as Partial<Message>))

    await this.loadContacts()
    await this.loadChat()

    this.resetSendMessageForm();
  }

  private resetSendMessageForm() {
    this.sendMessageForm.reset({
      "from_id": this.authService.userData?.id,
      "to_id": this.contactId
    });
  }

  voltar() {
    this._location.back()
  }
}
