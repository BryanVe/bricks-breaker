import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

interface ImagesProps {
  images: StringToStringMap
  selectedImageKey?: string
  selectImageKey: (key: string) => void
}

const Images: FC<ImagesProps> = (props) => {
  const { images, selectImageKey, selectedImageKey } = props
  const imageKeys = Object.keys(images)

  return (
    <div
      style={{
        padding: 16,
        display: 'grid',
        gridTemplateColumns: `repeat(${imageKeys.length}, auto)`,
        margin: '16px auto',
        gap: 16,
        overflowX: 'auto',
        maxWidth: '70%',
        backgroundColor: '#141414',
        // backgroundColor: '#EBEBEB',
        borderRadius: 10,
      }}
    >
      {imageKeys.map((key) => {
        const path = images[key]

        return (
          <div
            key={key}
            style={{
              position: 'relative',
              height: 150,
              justifySelf: 'center',
              cursor: 'pointer',
            }}
            onClick={() => selectImageKey(key)}
          >
            <img
              alt={key}
              src={path}
              style={{
                height: '100%',
                borderRadius: 10,
                objectFit: 'cover',
                opacity: key === selectedImageKey ? 0.4 : 1,
              }}
            />
            {key === selectedImageKey && (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#1a9d55',
                  fontSize: 48
                }}
                icon={faCircleCheck}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Images
