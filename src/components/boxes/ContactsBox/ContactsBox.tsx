import InfoBox from '../InfoBox/InfoBox';

function ContactsBox() {
  return (
    <InfoBox
      title="Контакты"
      data={[
        { 'Номер телефона ': '+7 (495) 596-82-73' },
        { 'E-mail': 'ortk-pro@mail.ru' },
        { WhatsApp: '+7 (929) 643-15-49' },
      ]}
    />
  );
}

export default ContactsBox;
