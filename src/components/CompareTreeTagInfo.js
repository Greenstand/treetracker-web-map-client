function CompareTreeTagInfo({ title }) {
  return (
    <>
      {(() => {
        switch (title) {
          case 'Age':
            return ' Years';
          case 'Diameter at Breast Height':
            return ' cm';
          default:
            return '';
        }
      })()}
    </>
  );
}

export default CompareTreeTagInfo;
