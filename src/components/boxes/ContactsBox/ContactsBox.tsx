import InfoBox from '../InfoBox/InfoBox';

function ContactsBox() {
  return (
    <InfoBox
      title="Контакты"
      data={[{ 'Ольга Иванова': '+7 (999) 999-99-99' }]}
    />
  );
}

export default ContactsBox;
